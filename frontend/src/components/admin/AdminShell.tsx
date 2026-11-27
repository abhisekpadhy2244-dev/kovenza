'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';
import { useAdmin } from './AdminProvider';
import { adminNav, roleLabels } from './adminNav';

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, can, signOut } = useAdmin();

  const items = user.mustChangePassword ? [] : adminNav.filter((item) => !item.permission || can(item.permission));

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-alt">
      <header className="border-b border-[color:var(--line)] bg-header">
        <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-heading sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-heading">{user.fullName}</p>
              <p className="text-xs">{roleLabels[user.roleKey] ?? user.roleKey}</p>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-heading px-5 text-sm font-semibold text-heading transition-colors hover:bg-hover hover:text-button-text"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        {items.length > 0 ? (
          <nav
            aria-label="Admin"
            className="flex gap-1 overflow-x-auto border-b border-[color:var(--line)] bg-header px-3 py-2 lg:block lg:min-h-[calc(100vh-4rem)] lg:space-y-1 lg:border-b-0 lg:border-r lg:px-4 lg:py-6"
          >
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[44px] shrink-0 items-center gap-3 rounded-xl px-4 text-[0.9375rem] font-medium text-nav transition-colors',
                    active ? 'bg-dark text-dark-text' : 'hover:bg-alt hover:text-heading',
                  )}
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : (
          <div />
        )}
        <main className="min-w-0 px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}