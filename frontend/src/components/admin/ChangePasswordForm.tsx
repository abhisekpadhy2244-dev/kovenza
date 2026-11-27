'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/fields';
import { ApiError } from '@/services/api';
import { adminPost } from '@/services/adminApi';
import { useAdmin } from './AdminProvider';

export function ChangePasswordForm() {
  const router = useRouter();
  const { user, reload } = useAdmin();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const local: Record<string, string> = {};
    if (!current) local.currentPassword = 'Current password is required';
    if (next.length < 12) local.newPassword = 'Password must be at least 12 characters';
    else if (!/[a-z]/.test(next) || !/[A-Z]/.test(next) || !/[0-9]/.test(next) || !/[^A-Za-z0-9]/.test(next)) {
      local.newPassword = 'Use upper and lower case letters, a number and a symbol';
    }
    if (next !== confirm) local.confirmPassword = 'The passwords do not match';
    setErrors(local);
    if (Object.keys(local).length > 0) return;

    setBusy(true);
    try {
      await adminPost('/auth/change-password', { currentPassword: current, newPassword: next });
      setDone(true);
      await reload();
      router.replace('/admin');
    } catch (caught) {
      if (caught instanceof ApiError) {
        setErrors(caught.fieldErrors);
        setFormError(caught.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-3xl">{user.mustChangePassword ? 'Set a new password' : 'Change password'}</h1>
      <p className="mt-3">
        {user.mustChangePassword
          ? 'For security, you must choose a new password before using the admin area.'
          : 'Other devices signed in to your account will be signed out.'}
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        aria-busy={busy}
        className="mt-8 space-y-5 rounded-2xl border border-[color:var(--line)] bg-page p-6 sm:p-8"
      >
        <TextField
          name="currentPassword"
          label="Current password"
          type="password"
          required
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          error={errors.currentPassword}
        />
        <TextField
          name="newPassword"
          label="New password"
          type="password"
          required
          autoComplete="new-password"
          hint="At least 12 characters, with upper and lower case letters, a number and a symbol."
          value={next}
          onChange={(event) => setNext(event.target.value)}
          error={errors.newPassword}
        />
        <TextField
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirmPassword}
        />

        {formError ? (
          <div role="alert" className="rounded-xl border border-[#B42318] bg-[#FEF3F2] p-4 text-sm font-medium text-[#B42318]">
            {formError}
          </div>
        ) : null}
        {done ? (
          <p role="status" className="text-sm font-medium text-heading">
            Password changed. Redirecting...
          </p>
        ) : null}

        <Button type="submit" disabled={busy} className="w-full sm:w-auto">
          {busy ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            'Update password'
          )}
        </Button>
      </form>
    </div>
  );
}