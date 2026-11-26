import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';
import { HttpError } from '../utils/httpError';
import { randomToken } from '../utils/security';

export const storageConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
);

if (storageConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type StoredKind = 'image' | 'document';

export interface StoredFile {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  sizeBytes: number;
}

export function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; kind: StoredKind },
): Promise<StoredFile> {
  if (!storageConfigured) {
    return Promise.reject(
      new HttpError(503, 'File storage is not configured on this server.', 'STORAGE_UNAVAILABLE'),
    );
  }

  const isImage = options.kind === 'image';
  const name = randomToken(16);

  return new Promise<StoredFile>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `kovenza/${options.folder}`,
        public_id: isImage ? name : `${name}.pdf`,
        resource_type: isImage ? 'image' : 'raw',
        type: isImage ? 'upload' : 'authenticated',
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'));
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          sizeBytes: result.bytes,
        });
      },
    );
    stream.end(buffer);
  });
}

/** Signed link for a private document. Only generate this for authorised staff. */
export function signedDocumentUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'authenticated',
    sign_url: true,
    secure: true,
  });
}

export async function deleteStored(publicId: string, kind: StoredKind): Promise<void> {
  if (!storageConfigured) return;
  await cloudinary.uploader.destroy(publicId, {
    resource_type: kind === 'image' ? 'image' : 'raw',
    type: kind === 'image' ? 'upload' : 'authenticated',
    invalidate: true,
  });
}