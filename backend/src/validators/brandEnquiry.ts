import { z } from 'zod';
import { BUDGET_RANGES, TIMELINES } from '../config/formOptions';
import {
  checked,
  email,
  emptyToUndefined,
  optionalText,
  phone,
  recordId,
  text,
  turnstileToken,
  website,
} from './common';

// Every field is required except the budget range (brief, Section 6.1).
export const brandEnquirySchema = z.object({
  fullName: text('Full name', 2, 100),
  businessEmail: email,
  companyName: text('Company name', 2, 120),
  country: text('Country', 2, 80),
  phone,
  website,
  industryId: recordId('Industry'),
  serviceId: recordId('Service'),
  objective: text('Campaign objective', 10, 2000),
  budgetRange: z.preprocess(emptyToUndefined, z.enum(BUDGET_RANGES).optional()),
  timeline: z.enum(TIMELINES, { errorMap: () => ({ message: 'Choose an expected timeline' }) }),
  additionalInfo: optionalText('Additional information', 2000),
  consentPrivacy: checked('You must agree to the Privacy Policy'),
  turnstileToken,
});

export type BrandEnquiryInput = z.infer<typeof brandEnquirySchema>;