'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ApiError } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function errorText(error: unknown): string {
  if (error instanceof ApiError) {
    const fields = Object.values(error.fieldErrors);
    return fields.length > 0 ? fields.join(' ') : error.message;
  }
  return 'Something went wrong. Please try again.';
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, ' ').toLowerCase();
  const tone =
    status === 'APPROVED'
      ? 'bg-dark text-dark-text'
      : status === 'REJECTED' || status === 'SUSPENDED'
        ? 'border border-[#B42318] bg-[#FEF3F2] text-[#B42318]'
        : 'border border-[color:var(--line)] bg-alt text-heading';
  return (
    <span className={cn('inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize', tone)}>{label}</span>
  );
}

export function Pager({
  page,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="mt-5 flex items-center justify-between gap-4 text-sm">
      <span>
        {total} {total === 1 ? 'record' : 'records'} · page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export function CreatorsTabs() {
  const pathname = usePathname();
  const onProfiles = pathname.startsWith('/admin/creators/profiles');
  const tab = (active: boolean) =>
    cn(
      'inline-flex min-h-[44px] items-center rounded-full px-5 text-sm font-semibold',
      active ? 'bg-dark text-dark-text' : 'border border-heading text-heading hover:bg-hover hover:text-button-text',
    );
  return (
    <nav aria-label="Creators" className="mb-6 flex gap-2">
      <Link href="/admin/creators" className={tab(!onProfiles)} aria-current={!onProfiles ? 'page' : undefined}>
        Applications
      </Link>
      <Link
        href="/admin/creators/profiles"
        className={tab(onProfiles)}
        aria-current={onProfiles ? 'page' : undefined}
      >
        Profiles
      </Link>
    </nav>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-xl border border-[#B42318] bg-[#FEF3F2] p-4 text-sm font-medium text-[#B42318]">
      {message}
    </div>
  );
}