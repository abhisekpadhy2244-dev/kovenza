import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import type { RoleKeyName } from '../config/permissions';
import { logActivity } from '../utils/activity';
import { HttpError } from '../utils/httpError';
import { hashPassword, verifyPassword } from '../utils/password';
import { randomToken } from '../utils/security';
import { createSession, revokeAllSessions } from './session';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const GENERIC_ERROR = 'Incorrect email or password.';

// Used so unknown emails take as long to reject as real ones (no account discovery by timing).
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword(randomToken(16)));

export interface StaffUserView {
  id: string;
  email: string;
  fullName: string;
  roleKey: RoleKeyName;
  permissions: string[];
  mustChangePassword: boolean;
}

export async function loginStaff(
  req: Request,
  res: Response,
  email: string,
  password: string,
): Promise<{ csrfToken: string; user: StaffUserView }> {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  const now = new Date();

  if (!user || !user.passwordHash || !user.role.isStaff) {
    await verifyPassword(await getDummyHash(), password);
    await logActivity({ req, action: 'admin.login_failed', entityType: 'User', metadata: { reason: 'unknown_or_not_staff' } });
    throw new HttpError(401, GENERIC_ERROR, 'INVALID_CREDENTIALS');
  }

  if (user.lockedUntil && user.lockedUntil > now) {
    await logActivity({ req, actorId: user.id, action: 'admin.login_blocked', entityType: 'User', entityId: user.id });
    throw new HttpError(429, 'Too many failed attempts. Please try again in a few minutes.', 'ACCOUNT_LOCKED');
  }

  const passwordOk = await verifyPassword(user.passwordHash, password);

  if (!passwordOk) {
    const attempts = user.failedLoginAttempts + 1;
    const lock = attempts >= MAX_FAILED_ATTEMPTS;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: lock ? 0 : attempts,
        lockedUntil: lock ? new Date(now.getTime() + LOCK_MS) : null,
      },
    });
    await logActivity({
      req,
      actorId: user.id,
      action: lock ? 'admin.account_locked' : 'admin.login_failed',
      entityType: 'User',
      entityId: user.id,
    });
    throw new HttpError(401, GENERIC_ERROR, 'INVALID_CREDENTIALS');
  }

  // Correct password but the account is not usable. Same message, so status is not revealed.
  if (user.status !== 'ACTIVE') {
    await logActivity({ req, actorId: user.id, action: 'admin.login_inactive', entityType: 'User', entityId: user.id });
    throw new HttpError(401, GENERIC_ERROR, 'INVALID_CREDENTIALS');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: now },
  });

  const { csrfToken } = await createSession(req, res, user.id);
  await logActivity({ req, actorId: user.id, action: 'admin.login', entityType: 'User', entityId: user.id });

  return {
    csrfToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roleKey: user.role.key as RoleKeyName,
      permissions: user.role.permissions,
      mustChangePassword: user.mustChangePassword,
    },
  };
}

export async function changeOwnPassword(
  req: Request,
  userId: string,
  sessionId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) throw HttpError.unauthorized();

  const ok = await verifyPassword(user.passwordHash, currentPassword);
  if (!ok) {
    await logActivity({ req, actorId: userId, action: 'admin.password_change_failed', entityType: 'User', entityId: userId });
    throw HttpError.badRequest('Please check the highlighted fields.', {
      currentPassword: ['Current password is incorrect'],
    });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, mustChangePassword: false, failedLoginAttempts: 0, lockedUntil: null },
  });

  // Sign out every other device. The current session stays.
  await revokeAllSessions(userId, sessionId);
  await logActivity({ req, actorId: userId, action: 'admin.password_changed', entityType: 'User', entityId: userId });
}