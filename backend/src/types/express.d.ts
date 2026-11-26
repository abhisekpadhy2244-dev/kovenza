import type { RoleKeyName } from '../config/permissions';

export interface AuthContext {
  sessionId: string;
  csrfSecret: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roleKey: RoleKeyName;
    isStaff: boolean;
    permissions: string[];
    mustChangePassword: boolean;
  };
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}