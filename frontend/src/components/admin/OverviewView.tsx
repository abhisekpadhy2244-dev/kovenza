'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ApiError } from '@/services/api';
import { adminGet } from '@/services/adminApi';
import { useAdmin } from './AdminProvider';
import { roleLabels } from './adminNav';

interface Overview {
  stats: {
    brands: number | null;
    creatorApplications: number | null;
    approvedCreators: number | null;
    pendingApplications: number | null;
    enquiries: number | null;
    activeCampaigns: number | null;
    completedCampaigns: number | null;
  };
  recentActivity:
    | { id: string; action: string; entityType: string; actorName: string | null; createdAt: string }[]
    | null;
}

const cards: { key: keyof Overview['stats']; label: string }[] = [
  { key: 'brands', label: 'Total brands' },
  { key: 'creatorApplications', label: 'Creator applications' },
  { key: 'approvedCreators', label: 'Approved creators' },
  { key: 'pendingApplications', label: 'Pending applications' },
  { key: 'enquiries', label: 'Total enquiries' },
  { key: 'activeCampaigns', label: 'Active campaigns' },
  { key: 'completedCampaigns', label: 'Completed campaigns' },
];

function describe(action: string): string {
  return action.replace(/[._]/g, ' ');
}

export function OverviewView() {
  const { user } = useAdmin();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminGet<Overview>('/overview')
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((caught) => {
        if (!cancelled) setError(caught instanceof ApiError ? caught.message : 'Could not load the overview.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = data ? cards.filter((card) => data.stats[card.key] !== null) : [];

  return (
    <div>
      <p className="eyebrow mb-2">{roleLabels[user.roleKey] ?? user.roleKey}</p>
      <h1 className="text-3xl sm:text-4xl">Welcome, {user.fullName.split(' ')[0]}.</h1>

      {error ? (
        <p role="alert" className="mt-8 font-medium text-[#B42318]">
          {error}
        </p>
      ) : !data ? (
        <p role="status" className="mt-8 flex items-center gap-2">
          <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Loading overview...
        </p>
      ) : (
        <>
          {visible.length > 0 ? (
            <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visible.map((card) => (
                <div key={card.key} className="rounded-2xl border border-[color:var(--line)] bg-page p-6">
                  <dt className="text-sm font-medium">{card.label}</dt>
                  <dd className="mt-2 font-serif text-4xl text-heading">{data.stats[card.key]}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-8 max-w-xl">
              Your role does not include dashboard figures. Your website content tools will appear in the menu
              as they are added.
            </p>
          )}

          {data.recentActivity ? (
            <section aria-labelledby="activity-heading" className="mt-12">
              <h2 id="activity-heading" className="text-2xl">
                Recent activity
              </h2>
              {data.recentActivity.length === 0 ? (
                <p className="mt-4">No activity yet.</p>
              ) : (
                <ul className="mt-5 divide-y divide-[color:var(--line)] rounded-2xl border border-[color:var(--line)] bg-page">
                  {data.recentActivity.map((item) => (
                    <li key={item.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-heading">
                        <span className="font-semibold capitalize">{describe(item.action)}</span>
                        <span className="text-body">
                          {' '}
                          · {item.entityType}
                          {item.actorName ? ` · ${item.actorName}` : ''}
                        </span>
                      </span>
                      <time dateTime={item.createdAt} className="text-sm">
                        {new Date(item.createdAt).toLocaleString('en-GB', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}