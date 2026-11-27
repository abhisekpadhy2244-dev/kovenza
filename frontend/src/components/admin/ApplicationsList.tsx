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
  applicationCode: string;
  fullName: string;
  email: string;
  country: string;
  category: string;
  status: string;
  createdAt: string;
}
interface Result {
  items: Row[];
  total: number;
  page: number;
  pageSize: number;
}

const STATUSES = [
  ['', 'All statuses'],
  ['SUBMITTED', 'Submitted'],
  ['UNDER_REVIEW', 'Under review'],
  ['INFO_REQUESTED', 'Info requested'],
  ['APPROVED', 'Approved'],
  ['REJECTED', 'Rejected'],
];

export function ApplicationsList() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set('status', status);
    if (applied) params.set('q', applied);
    setError(null);
    adminGet<Result>(`/creators/applications?${params.toString()}`)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((caught) => {
        if (!cancelled) setError(errorText(caught));
      });
    return () => {
      cancelled = true;
    };
  }, [status, applied, page]);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setApplied(search.trim());
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Creators</h1>
      <p className="mt-2 mb-6">Review applications to join the creator network.</p>
      <CreatorsTabs />

      <form onSubmit={onSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="app-status">
          Status
        </label>
        <select
          id="app-status"
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
          className={`${controlClass(false)} sm:max-w-[220px]`}
        >
          {STATUSES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="app-search">
          Search
        </label>
        <input
          id="app-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email or reference"
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
            No applications match.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-[color:var(--line)] bg-page">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-[color:var(--line)] text-xs uppercase tracking-[0.12em] text-heading">
                  <tr>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--line)]">
                  {data.items.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/creators/applications/${row.id}`}
                          className="font-semibold text-heading underline-offset-4 hover:text-highlight hover:underline"
                        >
                          {row.fullName}
                        </Link>
                        <div className="text-xs">
                          {row.applicationCode} · {row.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">{row.category}</td>
                      <td className="px-4 py-3">{row.country}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3">{formatDate(row.createdAt)}</td>
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