'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextAreaField } from '@/components/forms/fields';
import { adminGet, adminPost } from '@/services/adminApi';
import { useAdmin } from './AdminProvider';
import { ErrorNote, StatusBadge, errorText, formatDate } from './common';

interface Detail {
  id: string;
  applicationCode: string;
  status: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  otherSocials: string | null;
  audienceSize: number | null;
  languages: string[];
  biography: string;
  collaborationInterests: string;
  category: string;
  createdAt: string;
  reviewMessage: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  mediaKit: { name: string | null; sizeBytes: number; url: string } | null;
  profileId: string | null;
  notes: { id: string; body: string; author: string; createdAt: string }[];
}

const OPEN = ['SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED'];

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-heading">{label}</dt>
      <dd className="min-w-0 whitespace-pre-wrap break-words">{children}</dd>
    </div>
  );
}

function SocialValue({ value }: { value: string | null }) {
  if (!value) return <span>Not given</span>;
  if (/^https?:\/\//i.test(value)) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-heading underline underline-offset-4 hover:text-highlight">
        {value}
      </a>
    );
  }
  return <span>{value}</span>;
}

export function ApplicationDetail({ id }: { id: string }) {
  const { can } = useAdmin();
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await adminGet<Detail>(`/creators/applications/${id}`));
    } catch (caught) {
      setError(errorText(caught));
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const review = async (action: string, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    if (action === 'request_info' && !message.trim()) {
      setError('Write what information you need from the creator first.');
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await adminPost(`/creators/applications/${id}/review`, { action, message: message.trim() || undefined });
      setMessage('');
      setNotice('Saved. The creator has been emailed where applicable.');
      await load();
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };

  const addNote = async (event: FormEvent) => {
    event.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await adminPost(`/creators/applications/${id}/notes`, { body: note });
      setNote('');
      await load();
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return error ? (
      <ErrorNote message={error} />
    ) : (
      <p role="status" className="flex items-center gap-2">
        <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Loading...
      </p>
    );
  }

  const isOpen = OPEN.includes(data.status);
  const canReview = can('creators:review');

  return (
    <div className="max-w-4xl">
      <Link href="/admin/creators" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-heading hover:text-highlight">
        <ArrowLeft size={16} aria-hidden="true" /> All applications
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl sm:text-4xl">{data.fullName}</h1>
        <StatusBadge status={data.status} />
      </div>
      <p className="mt-2">
        {data.applicationCode} · received {formatDate(data.createdAt)}
      </p>

      <dl className="mt-8 divide-y divide-[color:var(--line)] rounded-2xl border border-[color:var(--line)] bg-page px-5 sm:px-6">
        <Row label="Email">{data.email}</Row>
        <Row label="Phone">{data.phone}</Row>
        <Row label="Location">
          {data.city}, {data.country}
        </Row>
        <Row label="Category">{data.category}</Row>
        <Row label="Instagram">
          <SocialValue value={data.instagram} />
        </Row>
        <Row label="YouTube">
          <SocialValue value={data.youtube} />
        </Row>
        <Row label="TikTok">
          <SocialValue value={data.tiktok} />
        </Row>
        <Row label="Other profiles">{data.otherSocials || 'Not given'}</Row>
        <Row label="Audience (self-reported)">
          {data.audienceSize !== null ? data.audienceSize.toLocaleString('en-US') : 'Not given'}
        </Row>
        <Row label="Languages">{data.languages.join(', ')}</Row>
        <Row label="Biography">{data.biography}</Row>
        <Row label="Collaboration interests">{data.collaborationInterests}</Row>
        <Row label="Media kit">
          {data.mediaKit ? (
            <a
              href={data.mediaKit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-heading underline underline-offset-4 hover:text-highlight"
            >
              <FileText size={16} aria-hidden="true" />
              {data.mediaKit.name ?? 'Media kit'} ({Math.round(data.mediaKit.sizeBytes / 1024)} KB)
            </a>
          ) : (
            'None uploaded'
          )}
        </Row>
      </dl>

      <section aria-labelledby="review-heading" className="mt-10 rounded-2xl border border-[color:var(--line)] bg-page p-5 sm:p-6">
        <h2 id="review-heading" className="text-2xl">
          Review
        </h2>

        {data.reviewedBy ? (
          <p className="mt-2 text-sm">
            Last action by {data.reviewedBy} on {formatDate(data.reviewedAt)}.
          </p>
        ) : null}
        {data.reviewMessage ? (
          <p className="mt-3 whitespace-pre-wrap rounded-xl bg-alt p-4 text-sm">
            <strong className="text-heading">Message sent: </strong>
            {data.reviewMessage}
          </p>
        ) : null}

        {data.profileId ? (
          <p className="mt-4">
            <Link
              href={`/admin/creators/profiles/${data.profileId}`}
              className="font-semibold text-heading underline underline-offset-4 hover:text-highlight"
            >
              Open the creator profile
            </Link>
          </p>
        ) : null}

        {!canReview ? (
          <p className="mt-4 text-sm">Your role can view applications but not review them.</p>
        ) : !isOpen ? (
          <p className="mt-4 text-sm">This application has been decided and can no longer be changed.</p>
        ) : (
          <div className="mt-5 space-y-5">
            <TextAreaField
              name="reviewMessage"
              label="Message to the creator"
              rows={4}
              hint="Optional for approve and reject. Required to request more information. It is included in the email."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={busy}
                onClick={() =>
                  void review('approve', 'Approve this application? A draft profile is created and the creator is emailed.')
                }
              >
                Approve
              </Button>
              <Button variant="secondary" disabled={busy} onClick={() => void review('request_info')}>
                Request more information
              </Button>
              {data.status === 'SUBMITTED' ? (
                <Button variant="secondary" disabled={busy} onClick={() => void review('start_review')}>
                  Mark under review
                </Button>
              ) : null}
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void review('reject', 'Reject this application? The creator is emailed and this cannot be undone.')}
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <ErrorNote message={error} />
          {notice ? (
            <p role="status" className="text-sm font-medium text-heading">
              {notice}
            </p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="notes-heading" className="mt-10">
        <h2 id="notes-heading" className="text-2xl">
          Private notes
        </h2>
        <p className="mt-1 text-sm">Only the KOVÉNZA team can see these.</p>

        {canReview ? (
          <form onSubmit={addNote} className="mt-4 space-y-3">
            <TextAreaField
              name="note"
              label="Add a note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <Button type="submit" variant="secondary" disabled={busy || !note.trim()}>
              Save note
            </Button>
          </form>
        ) : null}

        {data.notes.length === 0 ? (
          <p className="mt-4">No notes yet.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {data.notes.map((item) => (
              <li key={item.id} className="rounded-2xl border border-[color:var(--line)] bg-page p-4">
                <p className="whitespace-pre-wrap break-words text-heading">{item.body}</p>
                <p className="mt-2 text-xs">
                  {item.author} · {formatDate(item.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}