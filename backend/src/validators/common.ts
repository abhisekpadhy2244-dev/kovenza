import { z } from 'zod';
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import { stripHtml } from '../utils/sanitize';

export const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

/** Required plain text: HTML is stripped, then length is checked. */
export const text = (label: string, min: number, max: number) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} is required` })
    .transform(stripHtml)
    .pipe(
      z
        .string()
        .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
        .max(max, `${label} must be at most ${max} characters`),
    );

/** Optional plain text: an empty string counts as "not provided". */
export const optionalText = (label: string, max: number) =>
  z.preprocess(emptyToUndefined, text(label, 1, max).optional());

export const email = z
  .string({ required_error: 'Email is required', invalid_type_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')
  .max(254, 'Email is too long');

/** Expects international format (+91...). Stored as E.164. */
export const phone = z
  .string({ required_error: 'Phone number is required', invalid_type_error: 'Phone number is required' })
  .trim()
  .refine((value) => isValidPhoneNumber(value), 'Enter a valid phone number with country code')
  .transform((value) => parsePhoneNumberFromString(value)?.number ?? value);

/** Accepts "example.com" or a full http(s) address. Stored as a full URL. */
export const website = z
  .string({ required_error: 'Website is required', invalid_type_error: 'Website is required' })
  .trim()
  .min(1, 'Website is required')
  .max(200, 'Website address is too long')
  .transform((value) => (/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`))
  .refine((value) => {
    try {
      const url = new URL(value);
      return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
    } catch {
      return false;
    }
  }, 'Enter a valid website address')
  .transform((value) => new URL(value).href);

/** True / "true" / "on" / "1" become true. The consent box must be ticked. */
export const checked = (message: string) =>
  z.preprocess(
    (value) => value === true || value === 'true' || value === 'on' || value === '1',
    z.literal(true, { errorMap: () => ({ message }) }),
  );

export const recordId = (label: string) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(40, `${label} is invalid`);

export const turnstileToken = z.string().max(2048).optional();