import multer from 'multer';
import type { RequestHandler } from 'express';
import { HttpError } from '../utils/httpError';

const MB = 1024 * 1024;

export type UploadKind = 'image' | 'document';

const RULES: Record<UploadKind, { maxBytes: number; mimes: string[]; label: string }> = {
  image: {
    maxBytes: 5 * MB,
    mimes: ['image/jpeg', 'image/png', 'image/webp'],
    label: 'a JPG, PNG or WebP image up to 5 MB',
  },
  document: {
    maxBytes: 10 * MB,
    mimes: ['application/pdf'],
    label: 'a PDF up to 10 MB',
  },
};

/** Detects the real file type from its first bytes, ignoring the name and declared type. */
export function sniffMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png';
  }
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp';
  }
  if (buffer.subarray(0, 5).toString('ascii') === '%PDF-') return 'application/pdf';
  return null;
}

/** Strips any path and unusual characters from a client-supplied file name. */
export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  return base.replace(/[^\w.\- ]+/g, '_').slice(0, 120) || 'file';
}

/** Accepts at most one file in the given form field. Files stay in memory (no local disk). */
export function singleUpload(field: string, kind: UploadKind): RequestHandler[] {
  const rule = RULES[kind];

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: rule.maxBytes, files: 1, fields: 40, fieldSize: 20 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!rule.mimes.includes(file.mimetype)) {
        return cb(new HttpError(400, `Unsupported file type. Please upload ${rule.label}.`, 'BAD_FILE_TYPE'));
      }
      cb(null, true);
    },
  });

  const verifyContent: RequestHandler = (req, _res, next) => {
    const file = req.file;
    if (!file) return next();
    const real = sniffMime(file.buffer);
    if (!real || !rule.mimes.includes(real)) {
      return next(new HttpError(400, `That file does not look valid. Please upload ${rule.label}.`, 'BAD_FILE_CONTENT'));
    }
    file.mimetype = real;
    next();
  };

  return [upload.single(field), verifyContent];
}