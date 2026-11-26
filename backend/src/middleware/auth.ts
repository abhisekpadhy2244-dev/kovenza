import type { RequestHandler } from 'express';
import { prisma } from '../config/prisma';
import type { RoleKeyName } from '../config/permissions';
import { SESSION_COOKIE } from '../services/session';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';
import { safeEqual, sha256 } from '../utils/security';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const TOUCH_AFTER_MS = 5 * 60 * 1000;

/**
 * Reads the session cookie and, if it is valid, sets req.auth.
 * It never rejects a request by itself. Use requireAuth for that.
 */
export const authenticate: RequestHandler = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token !== 'string' || !token) return next();

  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: { include: { role: true } } },
  });

  const now = new Date();
  if (!session || session.revokedAt || session.expiresAt <= now) return next();
  if (session.user.status !== 'ACTIVE') return next();

  req.auth = {
    sessionId: session.id,
    csrfSecret: session.csrfSecret,
    user: {
      id: session.user.id,
      email: session.user.email,
      fullName: session.user.fullName,
      roleKey: session.user.role.key as RoleKeyName,
      isStaff: session.user.role.isStaff,
      permissions: session.user.role.permissions,
      mustChangePassword: session.user.mustChangePassword,
    },
  };

  if (now.getTime() - session.lastSeenAt.getTime() > TOUCH_AFTER_MS) {
    void prisma.session
      .update({ where: { id: session.id }, data: { lastSeenAt: now } })
      .catch(() => undefined);
  }

  next();
});

function makeRequireAuth(allowPasswordChange: boolean): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) return next(HttpError.unauthorized());
    if (req.auth.user.mustChangePassword && !allowPasswordChange) {
      return next(new HttpError(403, 'You must change your password first.', 'PASSWORD_CHANGE_REQUIRED'));
    }
    next();
  };
}

/** Requires a logged-in user who has no pending forced password change. */
export const requireAuth: RequestHandler = makeRequireAuth(false);

/** Same, but lets users with a forced password change through (for the change-password route only). */
export const requireAuthAllowPasswordChange: RequestHandler = makeRequireAuth(true);

/** State-changing requests must carry the session's CSRF token in the X-CSRF-Token header. */
export const requireCsrf: RequestHandler = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (!req.auth) return next(HttpError.unauthorized());

  const sent = req.get('x-csrf-token');
  if (!sent || !safeEqual(sent, req.auth.csrfSecret)) {
    return next(new HttpError(403, 'Invalid or missing CSRF token', 'CSRF_TOKEN'));
  }
  next();
};