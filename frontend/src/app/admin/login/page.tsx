import type { Metadata } from 'next';
import { Logo } from '@/components/layout/Logo';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-alt px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-heading">Team sign in</p>
        </div>
        <div className="rounded-3xl border border-[color:var(--line)] bg-page p-6 sm:p-8">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-center text-xs">Authorised KOVÉNZA team members only.</p>
      </div>
    </main>
  );
}