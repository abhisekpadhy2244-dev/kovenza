'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CheckboxField, SelectField, TextAreaField, TextField, controlClass } from '@/components/forms/fields';
import { adminDelete, adminGet, adminPatch, adminPost, adminUpload } from '@/services/adminApi';
import { useAdmin } from './AdminProvider';
import { ErrorNote, StatusBadge, errorText } from './common';

interface Social {
  id: string;
  platform: string;
  handle: string | null;
  url: string;
  isVerified: boolean;
}
interface Profile {
  id: string;
  slug: string;
  displayName: string;
  shortIntro: string;
  biography: string;
  categoryId: string;
  niches: string[];
  country: string;
  city: string | null;
  languages: string[];
  audienceSize: number | null;
  audienceVerified: boolean;
  collaborationInterests: string | null;
  status: string;
  isPublished: boolean;
  photoUrl: string | null;
  applicationId: string | null;
  applicationCode: string | null;
  socialAccounts: Social[];
  categories: { id: string; name: string }[];
}

interface FormState {
  displayName: string;
  shortIntro: string;
  biography: string;
  categoryId: string;
  niches: string;
  country: string;
  city: string;
  languages: string;
  audienceSize: string;
  audienceVerified: boolean;
  collaborationInterests: string;
}

const PLATFORMS = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'X', 'LINKEDIN', 'SNAPCHAT', 'OTHER'];

const toForm = (p: Profile): FormState => ({
  displayName: p.displayName,
  shortIntro: p.shortIntro,
  biography: p.biography,
  categoryId: p.categoryId,
  niches: p.niches.join(', '),
  country: p.country,
  city: p.city ?? '',
  languages: p.languages.join(', '),
  audienceSize: p.audienceSize === null ? '' : String(p.audienceSize),
  audienceVerified: p.audienceVerified,
  collaborationInterests: p.collaborationInterests ?? '',
});

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export function ProfileEditor({ id }: { id: string }) {
  const { can } = useAdmin();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newPlatform, setNewPlatform] = useState('INSTAGRAM');
  const [newUrl, setNewUrl] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await adminGet<Profile>(`/creators/profiles/${id}`);
      setProfile(data);
      setForm(toForm(data));
    } catch (caught) {
      setError(errorText(caught));
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (task: () => Promise<unknown>, success: string, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await task();
      setNotice(success);
      await load();
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };

  const set = (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => (current ? { ...current, [key]: event.target.value } : current));

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    const size = form.audienceSize.trim().replace(/,/g, '');
    if (size !== '' && !/^\d+$/.test(size)) {
      setError('Audience size must be a whole number.');
      return;
    }
    const body = {
      displayName: form.displayName,
      biography: form.biography,
      categoryId: form.categoryId,
      country: form.country,
      niches: splitList(form.niches),
      languages: splitList(form.languages),
      audienceSize: size === '' ? null : Number(size),
      audienceVerified: form.audienceVerified,
      // Blank values are left unchanged on the server.
      ...(form.shortIntro.trim() ? { shortIntro: form.shortIntro } : {}),
      ...(form.city.trim() ? { city: form.city } : {}),
      ...(form.collaborationInterests.trim() ? { collaborationInterests: form.collaborationInterests } : {}),
    };
    void run(() => adminPatch(`/creators/profiles/${id}`, body), 'Profile saved.');
  };

  const uploadPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const body = new FormData();
    body.append('photo', file);
    void run(() => adminUpload(`/creators/profiles/${id}/photo`, body), 'Photo updated.');
  };

  const addSocial = (event: FormEvent) => {
    event.preventDefault();
    if (!newUrl.trim()) return;
    void run(async () => {
      await adminPost(`/creators/profiles/${id}/social`, { platform: newPlatform, url: newUrl.trim() });
      setNewUrl('');
    }, 'Social account added.');
  };

  if (!profile || !form) {
    return error ? (
      <ErrorNote message={error} />
    ) : (
      <p role="status" className="flex items-center gap-2">
        <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Loading...
      </p>
    );
  }

  const canEdit = can('creators:edit');
  const canPublish = can('creators:publish');
  const canSuspend = can('creators:suspend');
  const suspended = profile.status === 'SUSPENDED';

  return (
    <div className="max-w-4xl">
      <Link href="/admin/creators/profiles" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-heading hover:text-highlight">
        <ArrowLeft size={16} aria-hidden="true" /> All profiles
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl sm:text-4xl">{profile.displayName}</h1>
        <StatusBadge status={profile.status} />
        <span className="text-sm font-semibold text-heading">{profile.isPublished ? 'Published' : 'Not published'}</span>
      </div>
      {profile.applicationId ? (
        <p className="mt-2 text-sm">
          From application{' '}
          <Link href={`/admin/creators/applications/${profile.applicationId}`} className="font-semibold text-heading underline underline-offset-4 hover:text-highlight">
            {profile.applicationCode}
          </Link>
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <ErrorNote message={error} />
        {notice ? (
          <p role="status" className="text-sm font-medium text-heading">
            {notice}
          </p>
        ) : null}
      </div>

      <section aria-labelledby="visibility-heading" className="mt-8 rounded-2xl border border-[color:var(--line)] bg-page p-5 sm:p-6">
        <h2 id="visibility-heading" className="text-2xl">
          Visibility
        </h2>
        <p className="mt-2 text-sm">
          Only approved profiles that are published appear on the website. A short introduction is required before publishing.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {canPublish && !suspended ? (
            profile.isPublished ? (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void run(() => adminPost(`/creators/profiles/${id}/publish`, { publish: false }), 'Profile unpublished.')}
              >
                Unpublish
              </Button>
            ) : (
              <Button
                disabled={busy}
                onClick={() =>
                  void run(
                    () => adminPost(`/creators/profiles/${id}/publish`, { publish: true }),
                    'Profile published.',
                    'Publish this profile on the public website?',
                  )
                }
              >
                Publish
              </Button>
            )
          ) : null}
          {canSuspend ? (
            suspended ? (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void run(() => adminPost(`/creators/profiles/${id}/suspend`, { suspend: false }), 'Profile reinstated (not published).')}
              >
                Reinstate
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() =>
                  void run(
                    () => adminPost(`/creators/profiles/${id}/suspend`, { suspend: true }),
                    'Profile suspended.',
                    'Suspend this profile? It is removed from the website immediately.',
                  )
                }
              >
                Suspend
              </Button>
            )
          ) : null}
        </div>
      </section>

      <section aria-labelledby="photo-heading" className="mt-8 rounded-2xl border border-[color:var(--line)] bg-page p-5 sm:p-6">
        <h2 id="photo-heading" className="text-2xl">
          Profile photo
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoUrl} alt={`Profile of ${profile.displayName}`} className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-alt font-serif text-3xl text-heading" aria-hidden="true">
              {profile.displayName.charAt(0).toUpperCase()}
            </span>
          )}
          {canEdit ? (
            <div>
              <label htmlFor="photo-upload" className="mb-2 block text-sm font-semibold text-heading">
                {profile.photoUrl ? 'Replace photo' : 'Upload photo'}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={uploadPhoto}
                className={`${controlClass(false)} cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-button file:px-5 file:py-2 file:text-sm file:font-semibold file:text-button-text`}
              />
              <p className="mt-1.5 text-sm">JPG, PNG or WebP, up to 5 MB. Only use photos you have the right to publish.</p>
            </div>
          ) : null}
        </div>
      </section>

      <form onSubmit={save} className="mt-8">
        <fieldset disabled={!canEdit || busy} className="space-y-5 rounded-2xl border border-[color:var(--line)] bg-page p-5 sm:p-6">
          <legend className="px-2 text-xl font-serif text-heading">Profile details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="displayName" label="Display name" required value={form.displayName} onChange={set('displayName')} />
            <SelectField
              name="categoryId"
              label="Category"
              required
              placeholder="Select a category"
              options={profile.categories.map((item) => ({ value: item.id, label: item.name }))}
              value={form.categoryId}
              onChange={set('categoryId')}
            />
            <TextField name="country" label="Country" required value={form.country} onChange={set('country')} />
            <TextField name="city" label="City" value={form.city} onChange={set('city')} />
          </div>
          <TextAreaField
            name="shortIntro"
            label="Short introduction"
            rows={2}
            required
            hint="Shown on the creator card (10 to 200 characters). Required before publishing."
            value={form.shortIntro}
            onChange={set('shortIntro')}
          />
          <TextAreaField name="biography" label="Biography" required value={form.biography} onChange={set('biography')} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="niches" label="Content niches" hint="Separate with commas, for example: street food, travel vlogs" value={form.niches} onChange={set('niches')} />
            <TextField name="languages" label="Languages" required hint="Separate with commas" value={form.languages} onChange={set('languages')} />
          </div>
          <TextAreaField
            name="collaborationInterests"
            label="Collaboration interests"
            rows={3}
            value={form.collaborationInterests}
            onChange={set('collaborationInterests')}
          />
          <TextField name="audienceSize" label="Audience size" inputMode="numeric" value={form.audienceSize} onChange={set('audienceSize')} />
          <CheckboxField
            name="audienceVerified"
            checked={form.audienceVerified}
            onChange={(event) => setForm((current) => (current ? { ...current, audienceVerified: event.target.checked } : current))}
          >
            <strong className="text-heading">Audience verified.</strong> Tick only after the team has checked the number. Verified numbers are shown publicly. Unverified numbers are never shown.
          </CheckboxField>
          {canEdit ? (
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving...' : 'Save profile'}
            </Button>
          ) : (
            <p className="text-sm">Your role can view profiles but not edit them.</p>
          )}
        </fieldset>
      </form>

      <section aria-labelledby="social-heading" className="mt-8 rounded-2xl border border-[color:var(--line)] bg-page p-5 sm:p-6">
        <h2 id="social-heading" className="text-2xl">
          Social accounts
        </h2>
        <p className="mt-2 text-sm">Open each link, check the account really belongs to the creator, then mark it verified.</p>

        {profile.socialAccounts.length === 0 ? (
          <p className="mt-4">No social accounts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[color:var(--line)]">
            {profile.socialAccounts.map((social) => (
              <li key={social.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-heading">
                    {social.platform} · {social.isVerified ? 'Verified' : 'Not verified'}
                  </p>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-heading underline underline-offset-4 hover:text-highlight"
                  >
                    {social.url}
                  </a>
                </div>
                {canEdit ? (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      disabled={busy}
                      onClick={() =>
                        void run(
                          () => adminPatch(`/creators/profiles/${id}/social/${social.id}`, { isVerified: !social.isVerified }),
                          social.isVerified ? 'Verification removed.' : 'Marked as verified.',
                        )
                      }
                    >
                      {social.isVerified ? 'Remove verification' : 'Mark verified'}
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={busy}
                      onClick={() =>
                        void run(() => adminDelete(`/creators/profiles/${id}/social/${social.id}`), 'Social account removed.', 'Remove this social account?')
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {canEdit ? (
          <form onSubmit={addSocial} className="mt-5 grid gap-3 sm:grid-cols-[180px_1fr_auto] sm:items-end">
            <SelectField
              name="newPlatform"
              label="Platform"
              required
              placeholder="Platform"
              options={PLATFORMS.map((value) => ({ value, label: value }))}
              value={newPlatform}
              onChange={(event) => setNewPlatform(event.target.value)}
            />
            <TextField name="newUrl" label="Profile link" required placeholder="https://..." value={newUrl} onChange={(event) => setNewUrl(event.target.value)} />
            <Button type="submit" variant="secondary" disabled={busy || !newUrl.trim()}>
              Add
            </Button>
          </form>
        ) : null}
      </section>
    </div>
  );
}