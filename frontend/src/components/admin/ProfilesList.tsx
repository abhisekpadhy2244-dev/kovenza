'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { controlClass } from '@/components/forms/fields';
import { adminGet } from '@/services/adminApi';
import { CreatorsTabs, ErrorNote, Pager, StatusBadge, errorText, formatDate } from './common';

interface Row {
  id: string;
  displayName: string;
  category: string;
  country: string;
  status: string;
  isPublished: boolean;
  audienceSize: number | null;
  audienceVerified: boolean;
  updatedAt: string;
}
interface Result {
  items: Row[];
  total: number;
  page: number;
  pageSize: number;
}

export function ProfilesList() {
  const [status, setStatus] = useState('');
  const [published, setPublished] = useState('');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set('status', status);
    if (published) params.set('published', published);
    if (applied) params.set('q', applied);
    setError(null);
    adminGet<Result>(`/creators/profiles?${params.toString()}`)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((caught) => {
        if (!cancelled) setError(errorText(caught));
      });
    return () => {
      cancelled = true;
    };
  }, [status, published, applied, page]);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setApplied(search.trim());
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Creators</h1>
      <p className="mt-2 mb-6">Approved creator profiles. Only published profiles appear on the website.</p>
      <CreatorsTabs />

      <form onSubmit={onSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="prof-status">
          Status
        </label>
        <select
          id="prof-status"
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
          className={`${controlClass(false)} sm:max-w-[200px]`}
        >
          <option value="">All statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <label className="sr-only" htmlFor="prof-published">
          Published
        </label>
        <select
          id="prof-published"
          value={published}
          onChange={(event) => {
            setPage(1);
            setPublished(event.target.value);
          }}
          className={`${controlClass(false)} sm:max-w-[200px]`}
        >
          <option value="">Published or not</option>
          <option value="true">Published</option>
          <option value="false">Not published</option>
        </select>
        <label className="sr-only" htmlFor="prof-search">
          Search
        </label>
        <input
          id="prof-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or country"
          className={controlClass(false)}
        />
        <Button type="submit">Search</Button>
      </form>

      <ErrorNote message={error} />

      {!data && !error ? (
        <p role="status" className="flex items-center gap-2">
          <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Loading...
        </p>
      ) : null}

      {data ? (
        data.items.length === 0 ? (
          <p className="rounded-2xl border border-[color:var(--line)] bg-page p-8 text-center">
            No profiles yet. Profiles are created when you approve an application.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-[color:var(--line)] bg-page">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-[color:var(--line)] text-xs uppercase tracking-[0.12em] text-heading">
                  <tr>
                    <th className="px-4 py-3">Creator</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Website</th>
                    <th className="px-4 py-3">Audience</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--line)]">
                  {data.items.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/creators/profiles/${row.id}`}
                          className="font-semibold text-heading underline-offset-4 hover:text-highlight hover:underline"
                        >
                          {row.displayName}
                        </Link>
                        <div className="text-xs">{row.country}</div>
                      </td>
                      <td className="px-4 py-3">{row.category}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3">{row.isPublished ? 'Published' : 'Not published'}</td>
                      <td className="px-4 py-3">
                        {row.audienceSize !== null
                          ? `${row.audienceSize.toLocaleString('en-US')} ${row.audienceVerified ? '(verified)' : '(self-reported)'}`
                          : 'Not given'}
                      </td>
                      <td className="px-4 py-3">{formatDate(row.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={data.page} total={data.total} pageSize={data.pageSize} onPage={setPage} />
          </>
        )
      ) : null}
    </div>
  );
}