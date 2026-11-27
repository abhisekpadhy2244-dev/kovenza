'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ApiError } from '@/services/api';
import { adminGet, adminPost, setCsrfToken } from '@/services/adminApi';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  roleKey: string;
  permissions: string[];
  mustChangePassword: boolean;
}

interface AdminContextValue {
  user: AdminUser;
  can: (permission: string) => boolean;
  reload: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin must be used inside AdminProvider');
  return value;
}

const CHANGE_PASSWORD_PATH = '/admin/change-password';

export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminGet<{ csrfToken: string; user: AdminUser }>('/auth/me');
      setCsrfToken(data.csrfToken);
      setUser(data.user);
      setError(null);
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        router.replace('/admin/login');
        return;
      }
      setError(caught instanceof ApiError ? caught.message : 'Something went wrong. Please try again.');
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  // A forced password change blocks everything else.
  useEffect(() => {
    if (user?.mustChangePassword && pathname !== CHANGE_PASSWORD_PATH) {
      router.replace(CHANGE_PASSWORD_PATH);
    }
  }, [user, pathname, router]);

  const signOut = useCallback(async () => {
    try {
      await adminPost('/auth/logout');
    } catch {
      // Even if the request fails, leave the console.
    }
    setCsrfToken('');
    setUser(null);
    router.replace('/admin/login');
  }, [router]);

  if (error) {
    return (
      <div role="alert" className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-2xl">Could not load the admin area</h1>
        <p className="mt-3">{error}</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            void load();
          }}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-button px-7 font-semibold text-button-text hover:bg-hover"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!user || (user.mustChangePassword && pathname !== CHANGE_PASSWORD_PATH)) {
    return (
      <div role="status" className="px-5 py-24 text-center">
        Loading...
      </div>
    );
  }

  const granted = new Set(user.permissions);

  return (
    <AdminContext.Provider
      value={{ user, can: (permission) => granted.has(permission), reload: load, signOut }}
    >
      {children}
    </AdminContext.Provider>
  );
}