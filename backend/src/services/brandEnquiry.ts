import type { Request } from 'express';
import { prisma } from '../config/prisma';
import { brandEnquiryAckEmail, brandEnquiryAdminEmail } from '../email/templates';
import type { BrandEnquiryInput } from '../validators/brandEnquiry';
import { logActivity } from '../utils/activity';
import { withUniqueCode } from '../utils/codes';
import { HttpError } from '../utils/httpError';
import { hashIp } from '../utils/security';
import { emailAdmins, emailPerson } from './notify';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_EMAIL_PER_DAY = 5;

export async function createBrandEnquiry(req: Request, input: BrandEnquiryInput): Promise<{ enquiryCode: string }> {
  const recent = await prisma.brandEnquiry.count({
    where: { businessEmail: input.businessEmail, createdAt: { gte: new Date(Date.now() - DAY_MS) } },
  });
  if (recent >= MAX_PER_EMAIL_PER_DAY) {
    throw new HttpError(
      429,
      'We have already received several enquiries from this email address. Please wait before sending another.',
      'RATE_LIMITED',
    );
  }

  const [industry, service] = await Promise.all([
    prisma.industry.findFirst({ where: { id: input.industryId, isActive: true } }),
    prisma.service.findFirst({ where: { id: input.serviceId, isActive: true } }),
  ]);
  if (!industry || !service) {
    throw HttpError.badRequest('Please check the highlighted fields.', {
      ...(industry ? {} : { industryId: ['Choose a valid industry'] }),
      ...(service ? {} : { serviceId: ['Choose a valid service'] }),
    });
  }

  const enquiry = await withUniqueCode('ENQ', (enquiryCode) =>
    prisma.brandEnquiry.create({
      data: {
        enquiryCode,
        fullName: input.fullName,
        businessEmail: input.businessEmail,
        companyName: input.companyName,
        country: input.country,
        phone: input.phone,
        website: input.website,
        industryId: industry.id,
        serviceId: service.id,
        objective: input.objective,
        budgetRange: input.budgetRange ?? null,
        timeline: input.timeline,
        additionalInfo: input.additionalInfo ?? null,
        consentPrivacy: true,
        consentAt: new Date(),
        ipHash: hashIp(req.ip),
        source: 'website',
      },
    }),
  );

  await logActivity({
    req,
    action: 'enquiry.created',
    entityType: 'BrandEnquiry',
    entityId: enquiry.id,
    metadata: { code: enquiry.enquiryCode },
  });

  emailAdmins(
    brandEnquiryAdminEmail({
      code: enquiry.enquiryCode,
      fullName: enquiry.fullName,
      businessEmail: enquiry.businessEmail,
      companyName: enquiry.companyName,
      country: enquiry.country,
      phone: enquiry.phone,
      website: enquiry.website,
      industry: industry.name,
      service: service.name,
      objective: enquiry.objective,
      budgetRange: enquiry.budgetRange,
      timeline: enquiry.timeline,
      additionalInfo: enquiry.additionalInfo,
    }),
    enquiry.businessEmail,
  );
  emailPerson(enquiry.businessEmail, brandEnquiryAckEmail({ fullName: enquiry.fullName, code: enquiry.enquiryCode }));

  return { enquiryCode: enquiry.enquiryCode };
}