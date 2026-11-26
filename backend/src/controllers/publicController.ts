import { BUDGET_RANGES, TIMELINES } from '../config/formOptions';
import { prisma } from '../config/prisma';
import { createBrandEnquiry } from '../services/brandEnquiry';
import { createCreatorApplication } from '../services/creatorApplication';
import { verifyTurnstile } from '../services/turnstile';
import { asyncHandler } from '../utils/asyncHandler';
import { generateCode } from '../utils/codes';
import { brandEnquirySchema } from '../validators/brandEnquiry';
import { creatorApplicationSchema } from '../validators/creatorApplication';

const isHoneypotFilled = (body: unknown): boolean => {
  const value = (body as { hp?: unknown } | undefined)?.hp;
  return typeof value === 'string' && value.trim() !== '';
};

/** Dropdown data for both forms, so the frontend never hard-codes IDs. */
export const getFormOptions = asyncHandler(async (_req, res) => {
  const [services, industries, categories] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, slug: true, name: true },
    }),
    prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, slug: true, name: true },
    }),
    prisma.creatorCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, slug: true, name: true },
    }),
  ]);

  res.set('Cache-Control', 'public, max-age=60');
  res.json({ services, industries, categories, budgetRanges: BUDGET_RANGES, timelines: TIMELINES });
});

export const submitBrandEnquiry = asyncHandler(async (req, res) => {
  if (isHoneypotFilled(req.body)) {
    return void res.status(201).json({ enquiryCode: generateCode('ENQ') });
  }

  const input = brandEnquirySchema.parse(req.body);
  await verifyTurnstile(input.turnstileToken, req.ip);
  const result = await createBrandEnquiry(req, input);
  res.status(201).json(result);
});

export const submitCreatorApplication = asyncHandler(async (req, res) => {
  if (isHoneypotFilled(req.body)) {
    return void res.status(201).json({ applicationCode: generateCode('APP') });
  }

  const input = creatorApplicationSchema.parse(req.body);
  await verifyTurnstile(input.turnstileToken, req.ip);
  const result = await createCreatorApplication(req, input, req.file);
  res.status(201).json(result);
});