import { z } from 'zod';
import { emptyToUndefined, optionalText, recordId, text } from './common';

const pageParam = z.preprocess(
  (value) => (value === undefined || value === '' ? undefined : value),
  z.coerce.number().int().min(1).max(10000).default(1),
);

const search = z.preprocess(emptyToUndefined, z.string().trim().max(100).optional());

export const applicationListQuery = z.object({
  status: z.preprocess(
    emptyToUndefined,
    z.enum(['SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED', 'APPROVED', 'REJECTED']).optional(),
  ),
  q: search,
  page: pageParam,
});

export const profileListQuery = z.object({
  status: z.preprocess(emptyToUndefined, z.enum(['DRAFT', 'APPROVED', 'SUSPENDED']).optional()),
  published: z.preprocess(emptyToUndefined, z.enum(['true', 'false']).optional()),
  q: search,
  page: pageParam,
});

export const reviewSchema = z
  .object({
    action: z.enum(['approve', 'reject', 'request_info', 'start_review']),
    message: optionalText('Message', 2000),
  })
  .superRefine((value, ctx) => {
    if (value.action === 'request_info' && !value.message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['message'],
        message: 'Write what information you need from the creator',
      });
    }
  });

export const noteSchema = z.object({ body: text('Note', 1, 2000) });

export const profileUpdateSchema = z.object({
  displayName: text('Display name', 2, 100).optional(),
  shortIntro: text('Short introduction', 10, 200).optional(),
  biography: text('Biography', 20, 2000).optional(),
  categoryId: recordId('Category').optional(),
  niches: z.array(text('Niche', 2, 40)).max(8, 'Up to 8 niches').optional(),
  country: text('Country', 2, 80).optional(),
  city: text('City', 2, 80).optional(),
  languages: z.array(text('Language', 2, 40)).min(1, 'Add at least one language').max(10).optional(),
  audienceSize: z.number().int().min(0).max(2_000_000_000).nullable().optional(),
  audienceVerified: z.boolean().optional(),
  collaborationInterests: text('Collaboration interests', 5, 1000).optional(),
});

const platforms = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'X', 'LINKEDIN', 'SNAPCHAT', 'OTHER'] as const;

const httpUrl = z
  .string()
  .trim()
  .max(300)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Enter a full link starting with https://');

export const socialAddSchema = z.object({ platform: z.enum(platforms), url: httpUrl });

export const socialUpdateSchema = z.object({
  url: httpUrl.optional(),
  followerCount: z.number().int().min(0).max(2_000_000_000).nullable().optional(),
  isVerified: z.boolean().optional(),
});

export const publishSchema = z.object({ publish: z.boolean() });
export const suspendSchema = z.object({ suspend: z.boolean() });