import { z } from 'zod';
import {
  checked,
  email,
  emptyToUndefined,
  optionalText,
  phone,
  recordId,
  text,
  turnstileToken,
} from './common';

// A profile link (https://...) or an @handle. Anything else (for example "javascript:") is rejected.
function isSocialValue(value: string): boolean {
  if (/^https?:\/\//i.test(value)) {
    try {
      return new URL(value).hostname.includes('.');
    } catch {
      return false;
    }
  }
  return /^@?[A-Za-z0-9._-]{1,60}$/.test(value);
}

const social = (label: string) =>
  z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(200, `${label} is too long`)
      .refine(isSocialValue, `Enter a valid ${label} link or @handle`)
      .optional(),
  );

// The form is sent as multipart (for the media kit), so every value arrives as a string.
const audienceSize = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    return Number(String(value).replace(/,/g, ''));
  },
  z
    .number({ invalid_type_error: 'Enter a number' })
    .int('Enter a whole number')
    .min(0, 'Audience size cannot be negative')
    .max(2_000_000_000, 'Audience size is too large')
    .optional(),
);

const languages = z.preprocess(
  (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value.trim()) return [];
    if (value.trim().startsWith('[')) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value.split(',');
  },
  z
    .array(text('Language', 2, 40))
    .min(1, 'Choose at least one language')
    .max(10, 'Choose up to 10 languages')
    .transform((items) => Array.from(new Set(items))),
);

export const creatorApplicationSchema = z
  .object({
    fullName: text('Full name', 2, 100),
    email,
    phone,
    country: text('Country', 2, 80),
    city: text('City', 2, 80),
    ageConfirmed: checked('You must confirm that you meet the eligibility requirements'),
    instagram: social('Instagram'),
    youtube: social('YouTube'),
    tiktok: social('TikTok'),
    otherSocials: optionalText('Other social profiles', 1000),
    categoryId: recordId('Content category'),
    audienceSize,
    languages,
    biography: text('Biography', 20, 2000),
    collaborationInterests: text('Collaboration interests', 5, 1000),
    consentPrivacy: checked('You must agree to the Privacy Policy'),
    turnstileToken,
  })
  .refine((data) => Boolean(data.instagram || data.youtube || data.tiktok || data.otherSocials), {
    message: 'Add at least one social profile',
    path: ['instagram'],
  });

export type CreatorApplicationInput = z.infer<typeof creatorApplicationSchema>;