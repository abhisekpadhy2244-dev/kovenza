import { Router } from 'express';
import {
  adminChangePassword,
  adminLogin,
  adminLogout,
  adminMe,
} from '../controllers/adminAuthController';
import { getOverview } from '../controllers/adminController';
import { requireAuth, requireAuthAllowPasswordChange, requireCsrf } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';
import { requireStaff } from '../middleware/rbac';

export const adminRouter = Router();

// Public: the only admin route that does not need a session.
adminRouter.post('/auth/login', authLimiter, adminLogin);

// Everything below needs a staff session and (for changes) a CSRF token.
adminRouter.use(requireAuthAllowPasswordChange, requireStaff, requireCsrf);

adminRouter.get('/auth/me', adminMe);
adminRouter.post('/auth/logout', adminLogout);
adminRouter.post('/auth/change-password', authLimiter, adminChangePassword);

// Everything below also requires that any forced password change is finished.
adminRouter.use(requireAuth);

adminRouter.get('/overview', getOverview);