import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const MAX_MEDIA_KIT_BYTES = 10 * 1024 * 1024;

// A profile link (https://...) or an @handle. Mirrors the backend rule.
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
  z
    .string()
    .trim()
    .max(200, `${label} is too long`)
    .refine((value) => value === '' || isSocialValue(value), `Enter a valid ${label} link or @handle`);

export const creatorSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name').max(100, 'Name is too long'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .refine((value) => isValidPhoneNumber(value), 'Enter a valid phone number with country code'),
    country: z.string().min(1, 'Choose your country'),
    city: z.string().trim().min(2, 'Enter your city').max(80, 'City name is too long'),
    ageConfirmed: z
      .boolean()
      .refine((value) => value === true, 'You must confirm that you meet the eligibility requirements'),
    instagram: social('Instagram'),
    youtube: social('YouTube'),
    tiktok: social('TikTok'),
    otherSocials: z.string().trim().max(1000, 'Please keep this under 1000 characters'),
    categoryId: z.string().min(1, 'Choose a content category'),
    audienceSize: z
      .string()
      .trim()
      .refine((value) => value === '' || /^\d{1,3}(,?\d{3})*$|^\d+$/.test(value), 'Enter a whole number'),
    languages: z.array(z.string()).min(1, 'Choose at least one language').max(10, 'Choose up to 10 languages'),
    biography: z
      .string()
      .trim()
      .min(20, 'Please write at least 20 characters about yourself')
      .max(2000, 'Please keep this under 2000 characters'),
    collaborationInterests: z
      .string()
      .trim()
      .min(5, 'Tell us what kinds of collaborations interest you')
      .max(1000, 'Please keep this under 1000 characters'),
    consentPrivacy: z.boolean().refine((value) => value === true, 'You must agree to the Privacy Policy'),
    hp: z.string().optional(),
  })
  .refine((data) => Boolean(data.instagram || data.youtube || data.tiktok || data.otherSocials), {
    message: 'Add at least one social profile',
    path: ['instagram'],
  });

export type CreatorFormValues = z.infer<typeof creatorSchema>;

export const creatorDefaults: CreatorFormValues = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  ageConfirmed: false,
  instagram: '',
  youtube: '',
  tiktok: '',
  otherSocials: '',
  categoryId: '',
  audienceSize: '',
  languages: [],
  biography: '',
  collaborationInterests: '',
  consentPrivacy: false,
  hp: '',
};