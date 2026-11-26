import type { Request } from 'express';
import { deleteStored, storageConfigured, uploadBuffer, type StoredFile } from '../config/cloudinary';
import { prisma } from '../config/prisma';
import { creatorApplicationAckEmail, creatorApplicationAdminEmail } from '../email/templates';
import type { CreatorApplicationInput } from '../validators/creatorApplication';
import { logActivity } from '../utils/activity';
import { withUniqueCode } from '../utils/codes';
import { HttpError } from '../utils/httpError';
import { safeFileName } from '../middleware/upload';
import { hashIp } from '../utils/security';
import { emailAdmins, emailPerson } from './notify';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_EMAIL_PER_DAY = 3;

export async function createCreatorApplication(
  req: Request,
  input: CreatorApplicationInput,
  file?: Express.Multer.File,
): Promise<{ applicationCode: string }> {
  const recent = await prisma.creatorApplication.count({
    where: { email: input.email, createdAt: { gte: new Date(Date.now() - DAY_MS) } },
  });
  if (recent >= MAX_PER_EMAIL_PER_DAY) {
    throw new HttpError(
      429,
      'We have already received applications from this email address. Please wait before sending another.',
      'RATE_LIMITED',
    );
  }

  const category = await prisma.creatorCategory.findFirst({ where: { id: input.categoryId, isActive: true } });
  if (!category) {
    throw HttpError.badRequest('Please check the highlighted fields.', { categoryId: ['Choose a valid content category'] });
  }

  if (file && !storageConfigured) {
    throw new HttpError(503, 'Media kit uploads are not available right now. Please apply without a file.', 'STORAGE_UNAVAILABLE');
  }

  let stored: StoredFile | null = null;
  if (file) {
    stored = await uploadBuffer(file.buffer, { folder: 'media-kits', kind: 'document' });
  }

  let application;
  try {
    application = await withUniqueCode('APP', (applicationCode) =>
      prisma.creatorApplication.create({
        data: {
          applicationCode,
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          country: input.country,
          city: input.city,
          ageConfirmed: true,
          instagram: input.instagram ?? null,
          youtube: input.youtube ?? null,
          tiktok: input.tiktok ?? null,
          otherSocials: input.otherSocials ?? null,
          categoryId: category.id,
          audienceSize: input.audienceSize ?? null,
          languages: input.languages,
          biography: input.biography,
          collaborationInterests: input.collaborationInterests,
          consentPrivacy: true,
          consentAt: new Date(),
          ipHash: hashIp(req.ip),
          ...(stored && file
            ? {
                assets: {
                  create: {
                    kind: 'DOCUMENT' as const,
                    purpose: 'MEDIA_KIT' as const,
                    provider: 'cloudinary',
                    publicId: stored.publicId,
                    url: stored.url,
                    mimeType: file.mimetype,
                    sizeBytes: stored.sizeBytes || file.size,
                    originalName: safeFileName(file.originalname),
                    isPublic: false,
                  },
                },
              }
            : {}),
        },
      }),
    );
  } catch (error) {
    if (stored) {
      await deleteStored(stored.publicId, 'document').catch(() => undefined);
    }
    throw error;
  }

  await logActivity({
    req,
    action: 'creator_application.created',
    entityType: 'CreatorApplication',
    entityId: application.id,
    metadata: { code: application.applicationCode },
  });

  emailAdmins(
    creatorApplicationAdminEmail({
      code: application.applicationCode,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      country: application.country,
      city: application.city,
      category: category.name,
      instagram: application.instagram,
      youtube: application.youtube,
      tiktok: application.tiktok,
      otherSocials: application.otherSocials,
      audienceSize: application.audienceSize,
      languages: application.languages,
      biography: application.biography,
      collaborationInterests: application.collaborationInterests,
      hasMediaKit: Boolean(stored),
    }),
    application.email,
  );
  emailPerson(
    application.email,
    creatorApplicationAckEmail({ fullName: application.fullName, code: application.applicationCode }),
  );

  return { applicationCode: application.applicationCode };
}