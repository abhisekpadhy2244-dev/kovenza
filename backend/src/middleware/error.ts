import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
};

// Consistent error shape: { error: { code, message, details? } }
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please check the highlighted fields.',
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err?.name === 'MulterError') {
    return res.status(400).json({ error: { code: 'UPLOAD_ERROR', message: err.message } });
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'BAD_JSON', message: 'Invalid JSON body' } });
  }

  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'TOO_LARGE', message: 'Request body too large' } });
  }

  if (err?.name === 'PrismaClientKnownRequestError' && err?.code === 'P2002') {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'That record already exists' } });
  }

  // Unknown error: log it server-side, never leak internals to the client.
  console.error('[unhandled error]', err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: env.isProd ? 'Something went wrong' : String(err?.message ?? err),
    },
  });
};