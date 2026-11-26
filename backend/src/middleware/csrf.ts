import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function originOf(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const allowedOrigins = new Set(env.corsOrigins.map((value) => originOf(value) ?? value));

/**
 * Rejects state-changing requests (POST/PUT/PATCH/DELETE) that come from an origin
 * we do not trust. Requests with neither Origin nor Referer are only allowed when
 * they carry no session cookie (for example API tests and server-to-server calls).
 */
export const originCheck: RequestHandler = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin');
  const referer = req.get('referer');
  const source = origin ?? (referer ? originOf(referer) : null);

  if (source) {
    if (allowedOrigins.has(source)) return next();
    return next(new HttpError(403, 'Request origin not allowed', 'CSRF_ORIGIN'));
  }

  const hasSessionCookie = (req.headers.cookie ?? '').includes('kv_session');
  if (hasSessionCookie) {
    return next(new HttpError(403, 'Missing request origin', 'CSRF_ORIGIN'));
  }
  return next();
};