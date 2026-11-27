import { changeOwnPassword, loginStaff } from '../services/auth';
import { destroySession } from '../services/session';
import { logActivity } from '../utils/activity';
import { asyncHandler } from '../utils/asyncHandler';
import { changePasswordSchema, loginSchema } from '../validators/auth';

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const result = await loginStaff(req, res, email, password);
  res.json(result);
});

export const adminMe = asyncHandler(async (req, res) => {
  const { user, csrfSecret } = req.auth!;
  res.set('Cache-Control', 'no-store');
  res.json({
    csrfToken: csrfSecret,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roleKey: user.roleKey,
      permissions: user.permissions,
      mustChangePassword: user.mustChangePassword,
    },
  });
});

export const adminLogout = asyncHandler(async (req, res) => {
  await logActivity({ req, action: 'admin.logout', entityType: 'User', entityId: req.auth!.user.id });
  await destroySession(req, res);
  res.json({ ok: true });
});

export const adminChangePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
  const { user, sessionId } = req.auth!;
  await changeOwnPassword(req, user.id, sessionId, currentPassword, newPassword);
  res.json({ ok: true });
});