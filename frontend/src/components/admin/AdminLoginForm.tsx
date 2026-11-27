'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/fields';
import { ApiError } from '@/services/api';
import { adminPost, setCsrfToken } from '@/services/adminApi';

interface LoginResponse {
  csrfToken: string;
  user: { mustChangePassword: boolean };
}

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const local: Record<string, string> = {};
    if (!email.trim()) local.email = 'Email is required';
    if (!password) local.password = 'Password is required';
    setErrors(local);
    if (Object.keys(local).length > 0) return;

    setBusy(true);
    try {
      const result = await adminPost<LoginResponse>('/auth/login', { email, password });
      setCsrfToken(result.csrfToken);
      router.replace(result.user.mustChangePassword ? '/admin/change-password' : '/admin');
    } catch (caught) {
      if (caught instanceof ApiError) {
        setErrors(caught.fieldErrors);
        setFormError(caught.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      setPassword('');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={busy} className="space-y-5">
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
      />

      {formError ? (
        <div role="alert" className="rounded-xl border border-[#B42318] bg-[#FEF3F2] p-4 text-sm font-medium text-[#B42318]">
          {formError}
        </div>
      ) : null}

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}