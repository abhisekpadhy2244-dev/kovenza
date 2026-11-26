import type { RequestHandler } from 'express';
import type { Permission, RoleKeyName } from '../config/permissions';
import { HttpError } from '../utils/httpError';

/** Only KOVENZA team members (Super Admin, Admin, Campaign Manager, Content Manager). */
export const requireStaff: RequestHandler = (req, _res, next) => {
  if (!req.auth) return next(HttpError.unauthorized());
  if (!req.auth.user.isStaff) return next(HttpError.forbidden());
  next();
};

/** Only the listed roles, e.g. requireRole('CREATOR') for the Creator Portal. */
export function requireRole(...roles: RoleKeyName[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) return next(HttpError.unauthorized());
    if (!roles.includes(req.auth.user.roleKey)) return next(HttpError.forbidden());
    next();
  };
}

/** The user's role must include every listed permission. */
export function requirePermission(...permissions: Permission[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) return next(HttpError.unauthorized());
    if (!req.auth.user.isStaff) return next(HttpError.forbidden());
    const granted = new Set(req.auth.user.permissions);
    if (!permissions.every((permission) => granted.has(permission))) {
      return next(HttpError.forbidden());
    }
    next();
  };
}