import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

function isValidWebsite(value: string): boolean {
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

// Every field is required except the budget range (brief, Section 6.1).
export const brandSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100, 'Name is too long'),
  businessEmail: z.string().trim().min(1, 'Business email is required').email('Enter a valid email address'),
  companyName: z.string().trim().min(2, 'Enter your company name').max(120, 'Company name is too long'),
  country: z.string().min(1, 'Choose your country'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((value) => isValidPhoneNumber(value), 'Enter a valid phone number with country code'),
  website: z
    .string()
    .trim()
    .min(1, 'Website is required')
    .refine(isValidWebsite, 'Enter a valid website address'),
  industryId: z.string().min(1, 'Choose an industry'),
  serviceId: z.string().min(1, 'Choose a service'),
  objective: z
    .string()
    .trim()
    .min(10, 'Please describe your campaign objective (at least 10 characters)')
    .max(2000, 'Please keep this under 2000 characters'),
  budgetRange: z.string().optional(),
  timeline: z.string().min(1, 'Choose an expected timeline'),
  additionalInfo: z.string().trim().max(2000, 'Please keep this under 2000 characters').optional(),
  consentPrivacy: z.boolean().refine((value) => value === true, 'You must agree to the Privacy Policy'),
  hp: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;

export const brandDefaults: BrandFormValues = {
  fullName: '',
  businessEmail: '',
  companyName: '',
  country: '',
  phone: '',
  website: '',
  industryId: '',
  serviceId: '',
  objective: '',
  budgetRange: '',
  timeline: '',
  additionalInfo: '',
  consentPrivacy: false,
  hp: '',
};