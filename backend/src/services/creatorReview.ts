import type { Request } from 'express';
import type { ApplicationStatus, Prisma, ProfileStatus, SocialPlatform } from '@prisma/client';
import { deleteStored, signedDocumentUrl, uploadBuffer } from '../config/cloudinary';
import { prisma } from '../config/prisma';
import { creatorStatusEmail } from '../email/creatorStatus';
import { safeFileName } from '../middleware/upload';
import { logActivity } from '../utils/activity';
import { HttpError } from '../utils/httpError';
import { randomToken } from '../utils/security';
import { emailPerson } from './notify';

const PAGE_SIZE = 20;
const OPEN_STATUSES: ApplicationStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED'];

type ReviewAction = 'approve' | 'reject' | 'request_info' | 'start_review';

const NEXT_STATUS: Record<ReviewAction, ApplicationStatus> = {
  approve: 'APPROVED',
  reject: 'REJECTED',
  request_info: 'INFO_REQUESTED',
  start_review: 'UNDER_REVIEW',
};

const actorOf = (req: Request) => req.auth!.user.id;

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export async function listApplications(query: { status?: ApplicationStatus; q?: string; page: number }) {
  const where: Prisma.CreatorApplicationWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.q
      ? {
          OR: [
            { fullName: { contains: query.q, mode: 'insensitive' } },
            { email: { contains: query.q, mode: 'insensitive' } },
            { applicationCode: { contains: query.q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.creatorApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        applicationCode: true,
        fullName: true,
        email: true,
        country: true,
        status: true,
        audienceSize: true,
        createdAt: true,
        category: { select: { name: true } },
      },
    }),
    prisma.creatorApplication.count({ where }),
  ]);

  return {
    items: items.map((item) => ({ ...item, category: item.category.name })),
    total,
    page: query.page,
    pageSize: PAGE_SIZE,
  };
}

export async function getApplication(id: string) {
  const a = await prisma.creatorApplication.findUnique({
    where: { id },
    include: {
      category: true,
      reviewedBy: { select: { fullName: true } },
      assets: true,
      profile: { select: { id: true } },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { fullName: true } } },
      },
    },
  });
  if (!a) throw HttpError.notFound('Application not found');

  const kit = a.assets.find((asset) => asset.purpose === 'MEDIA_KIT');
  let mediaKit: { name: string | null; sizeBytes: number; url: string } | null = null;
  if (kit) {
    try {
      mediaKit = { name: kit.originalName, sizeBytes: kit.sizeBytes, url: signedDocumentUrl(kit.publicId) };
    } catch (error) {
      console.error('[media kit] could not sign link:', error);
    }
  }

  return {
    id: a.id,
    applicationCode: a.applicationCode,
    status: a.status,
    fullName: a.fullName,
    email: a.email,
    phone: a.phone,
    country: a.country,
    city: a.city,
    instagram: a.instagram,
    youtube: a.youtube,
    tiktok: a.tiktok,
    otherSocials: a.otherSocials,
    audienceSize: a.audienceSize,
    languages: a.languages,
    biography: a.biography,
    collaborationInterests: a.collaborationInterests,
    category: a.category.name,
    createdAt: a.createdAt,
    reviewMessage: a.reviewMessage,
    reviewedBy: a.reviewedBy?.fullName ?? null,
    reviewedAt: a.reviewedAt,
    mediaKit,
    profileId: a.profile?.id ?? null,
    notes: a.notes.map((note) => ({
      id: note.id,
      body: note.body,
      author: note.author.fullName,
      createdAt: note.createdAt,
    })),
  };
}

function socialUrl(platform: 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK', value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, '');
  if (platform === 'INSTAGRAM') return `https://www.instagram.com/${handle}`;
  if (platform === 'YOUTUBE') return `https://www.youtube.com/@${handle}`;
  return `https://www.tiktok.com/@${handle}`;
}

function slugify(value: string): string {
  const base = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '');
  return `${base || 'creator'}-${randomToken(3)}`;
}

export async function reviewApplication(req: Request, id: string, action: ReviewAction, message?: string) {
  const app = await prisma.creatorApplication.findUnique({ where: { id } });
  if (!app) throw HttpError.notFound('Application not found');
  if (!OPEN_STATUSES.includes(app.status)) {
    throw HttpError.conflict('This application has already been decided.');
  }

  const next = NEXT_STATUS[action];
  const actorId = actorOf(req);

  await prisma.$transaction(async (tx) => {
    // The status condition makes this safe if two admins act at the same moment.
    const changed = await tx.creatorApplication.updateMany({
      where: { id, status: { in: OPEN_STATUSES } },
      data: {
        status: next,
        reviewedById: actorId,
        reviewedAt: new Date(),
        ...(message !== undefined ? { reviewMessage: message } : {}),
      },
    });
    if (changed.count === 0) throw HttpError.conflict('This application has already been decided.');

    if (action === 'approve') {
      const existing = await tx.creatorProfile.findUnique({ where: { applicationId: id } });
      if (!existing) {
        const profile = await tx.creatorProfile.create({
          data: {
            slug: slugify(app.fullName),
            applicationId: id,
            displayName: app.fullName,
            shortIntro: '',
            biography: app.biography,
            categoryId: app.categoryId,
            niches: [],
            country: app.country,
            city: app.city,
            languages: app.languages,
            audienceSize: app.audienceSize,
            audienceVerified: false,
            collaborationInterests: app.collaborationInterests,
            status: 'APPROVED',
            isPublished: false,
          },
        });

        const socials: Prisma.SocialAccountCreateManyInput[] = [];
        const add = (platform: 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK', value: string | null) => {
          if (!value) return;
          socials.push({
            profileId: profile.id,
            platform,
            handle: /^https?:\/\//i.test(value) ? null : value.replace(/^@/, ''),
            url: socialUrl(platform, value),
          });
        };
        add('INSTAGRAM', app.instagram);
        add('YOUTUBE', app.youtube);
        add('TIKTOK', app.tiktok);
        if (socials.length > 0) await tx.socialAccount.createMany({ data: socials, skipDuplicates: true });
      }
    }
  });

  await logActivity({
    req,
    action: `creator_application.${action}`,
    entityType: 'CreatorApplication',
    entityId: id,
    metadata: { code: app.applicationCode, status: next },
  });

  if (action !== 'start_review') {
    const outcome = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'info_requested';
    emailPerson(
      app.email,
      creatorStatusEmail({ fullName: app.fullName, code: app.applicationCode, outcome, message }),
    );
  }

  return { status: next };
}

export async function addApplicationNote(req: Request, id: string, body: string) {
  const exists = await prisma.creatorApplication.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw HttpError.notFound('Application not found');

  const note = await prisma.adminNote.create({
    data: { body, authorId: actorOf(req), creatorApplicationId: id },
  });
  await logActivity({ req, action: 'creator_application.note_added', entityType: 'CreatorApplication', entityId: id });
  return { id: note.id };
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export async function listProfiles(query: {
  status?: ProfileStatus;
  published?: 'true' | 'false';
  q?: string;
  page: number;
}) {
  const where: Prisma.CreatorProfileWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.published ? { isPublished: query.published === 'true' } : {}),
    ...(query.q
      ? {
          OR: [
            { displayName: { contains: query.q, mode: 'insensitive' } },
            { country: { contains: query.q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.creatorProfile.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (query.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        displayName: true,
        status: true,
        isPublished: true,
        country: true,
        audienceSize: true,
        audienceVerified: true,
        updatedAt: true,
        category: { select: { name: true } },
      },
    }),
    prisma.creatorProfile.count({ where }),
  ]);

  return {
    items: items.map((item) => ({ ...item, category: item.category.name })),
    total,
    page: query.page,
    pageSize: PAGE_SIZE,
  };
}

export async function getProfile(id: string) {
  const [p, categories] = await Promise.all([
    prisma.creatorProfile.findUnique({
      where: { id },
      include: {
        socialAccounts: { orderBy: { platform: 'asc' } },
        assets: { where: { purpose: 'PROFILE_PHOTO' }, take: 1 },
        application: { select: { id: true, applicationCode: true } },
      },
    }),
    prisma.creatorCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    }),
  ]);
  if (!p) throw HttpError.notFound('Profile not found');

  return {
    id: p.id,
    slug: p.slug,
    displayName: p.displayName,
    shortIntro: p.shortIntro,
    biography: p.biography,
    categoryId: p.categoryId,
    niches: p.niches,
    country: p.country,
    city: p.city,
    languages: p.languages,
    audienceSize: p.audienceSize,
    audienceVerified: p.audienceVerified,
    collaborationInterests: p.collaborationInterests,
    status: p.status,
    isPublished: p.isPublished,
    photoUrl: p.assets[0]?.url ?? null,
    applicationId: p.application?.id ?? null,
    applicationCode: p.application?.applicationCode ?? null,
    socialAccounts: p.socialAccounts.map((s) => ({
      id: s.id,
      platform: s.platform,
      handle: s.handle,
      url: s.url,
      isVerified: s.isVerified,
    })),
    categories,
  };
}

interface ProfileUpdate {
  displayName?: string;
  shortIntro?: string;
  biography?: string;
  categoryId?: string;
  niches?: string[];
  country?: string;
  city?: string;
  languages?: string[];
  audienceSize?: number | null;
  audienceVerified?: boolean;
  collaborationInterests?: string;
}

export async function updateProfile(req: Request, id: string, input: ProfileUpdate) {
  const current = await prisma.creatorProfile.findUnique({ where: { id } });
  if (!current) throw HttpError.notFound('Profile not found');

  if (input.categoryId) {
    const category = await prisma.creatorCategory.findFirst({ where: { id: input.categoryId, isActive: true } });
    if (!category) throw HttpError.badRequest('Please check the highlighted fields.', { categoryId: ['Choose a valid category'] });
  }

  const data: Prisma.CreatorProfileUncheckedUpdateInput = { ...input };
  // A changed audience number is no longer verified, unless the admin says otherwise.
  if (
    input.audienceSize !== undefined &&
    input.audienceSize !== current.audienceSize &&
    input.audienceVerified === undefined
  ) {
    data.audienceVerified = false;
  }

  await prisma.creatorProfile.update({ where: { id }, data });
  await logActivity({
    req,
    action: 'creator_profile.updated',
    entityType: 'CreatorProfile',
    entityId: id,
    metadata: { fields: Object.keys(input) },
  });
}

export async function setPublished(req: Request, id: string, publish: boolean) {
  const profile = await prisma.creatorProfile.findUnique({ where: { id } });
  if (!profile) throw HttpError.notFound('Profile not found');

  if (publish) {
    if (profile.status !== 'APPROVED') throw HttpError.badRequest('Only approved profiles can be published.');
    if (!profile.shortIntro.trim()) {
      throw HttpError.badRequest('Add a short introduction before publishing this profile.');
    }
  }

  await prisma.creatorProfile.update({
    where: { id },
    data: { isPublished: publish, publishedAt: publish ? new Date() : null },
  });
  await logActivity({
    req,
    action: publish ? 'creator_profile.published' : 'creator_profile.unpublished',
    entityType: 'CreatorProfile',
    entityId: id,
  });
}

export async function setSuspended(req: Request, id: string, suspend: boolean) {
  const profile = await prisma.creatorProfile.findUnique({ where: { id } });
  if (!profile) throw HttpError.notFound('Profile not found');

  if (suspend) {
    if (profile.status !== 'APPROVED') throw HttpError.badRequest('Only approved profiles can be suspended.');
    await prisma.creatorProfile.update({
      where: { id },
      data: { status: 'SUSPENDED', isPublished: false, publishedAt: null },
    });
  } else {
    if (profile.status !== 'SUSPENDED') throw HttpError.badRequest('This profile is not suspended.');
    // Reinstated profiles come back unpublished, so an admin must choose to publish again.
    await prisma.creatorProfile.update({ where: { id }, data: { status: 'APPROVED' } });
  }
  await logActivity({
    req,
    action: suspend ? 'creator_profile.suspended' : 'creator_profile.reinstated',
    entityType: 'CreatorProfile',
    entityId: id,
  });
}

// ---------------------------------------------------------------------------
// Social accounts
// ---------------------------------------------------------------------------

export async function addSocial(req: Request, profileId: string, input: { platform: SocialPlatform; url: string }) {
  const profile = await prisma.creatorProfile.findUnique({ where: { id: profileId }, select: { id: true } });
  if (!profile) throw HttpError.notFound('Profile not found');

  const social = await prisma.socialAccount.create({
    data: { profileId, platform: input.platform, url: input.url },
  });
  await logActivity({ req, action: 'creator_social.added', entityType: 'CreatorProfile', entityId: profileId });
  return { id: social.id };
}

export async function updateSocial(
  req: Request,
  profileId: string,
  socialId: string,
  input: { url?: string; followerCount?: number | null; isVerified?: boolean },
) {
  const social = await prisma.socialAccount.findFirst({ where: { id: socialId, profileId } });
  if (!social) throw HttpError.notFound('Social account not found');

  const data: Prisma.SocialAccountUncheckedUpdateInput = {};
  if (input.url !== undefined && input.url !== social.url) {
    data.url = input.url;
    // A changed link has not been checked yet.
    if (input.isVerified === undefined) {
      data.isVerified = false;
      data.verifiedAt = null;
      data.verifiedById = null;
    }
  }
  if (input.followerCount !== undefined) data.followerCount = input.followerCount;
  if (input.isVerified !== undefined) {
    data.isVerified = input.isVerified;
    data.verifiedAt = input.isVerified ? new Date() : null;
    data.verifiedById = input.isVerified ? actorOf(req) : null;
  }

  await prisma.socialAccount.update({ where: { id: socialId }, data });
  await logActivity({
    req,
    action: input.isVerified === undefined ? 'creator_social.updated' : input.isVerified ? 'creator_social.verified' : 'creator_social.unverified',
    entityType: 'CreatorProfile',
    entityId: profileId,
    metadata: { socialId },
  });
}

export async function deleteSocial(req: Request, profileId: string, socialId: string) {
  const result = await prisma.socialAccount.deleteMany({ where: { id: socialId, profileId } });
  if (result.count === 0) throw HttpError.notFound('Social account not found');
  await logActivity({ req, action: 'creator_social.removed', entityType: 'CreatorProfile', entityId: profileId });
}

// ---------------------------------------------------------------------------
// Profile photo
// ---------------------------------------------------------------------------

export async function setProfilePhoto(req: Request, id: string, file: Express.Multer.File) {
  const profile = await prisma.creatorProfile.findUnique({ where: { id }, select: { id: true, displayName: true } });
  if (!profile) throw HttpError.notFound('Profile not found');

  const stored = await uploadBuffer(file.buffer, { folder: 'creator-photos', kind: 'image' });
  const previous = await prisma.uploadedAsset.findMany({ where: { creatorProfileId: id, purpose: 'PROFILE_PHOTO' } });

  try {
    await prisma.$transaction([
      prisma.uploadedAsset.deleteMany({ where: { creatorProfileId: id, purpose: 'PROFILE_PHOTO' } }),
      prisma.uploadedAsset.create({
        data: {
          kind: 'IMAGE',
          purpose: 'PROFILE_PHOTO',
          provider: 'cloudinary',
          publicId: stored.publicId,
          url: stored.url,
          mimeType: file.mimetype,
          sizeBytes: stored.sizeBytes || file.size,
          originalName: safeFileName(file.originalname),
          width: stored.width,
          height: stored.height,
          altText: `Profile photo of ${profile.displayName}`,
          isPublic: true,
          isCover: true,
          uploadedById: actorOf(req),
          creatorProfileId: id,
        },
      }),
    ]);
  } catch (error) {
    await deleteStored(stored.publicId, 'image').catch(() => undefined);
    throw error;
  }

  for (const old of previous) {
    await deleteStored(old.publicId, 'image').catch(() => undefined);
  }

  await logActivity({ req, action: 'creator_profile.photo_changed', entityType: 'CreatorProfile', entityId: id });
  return { photoUrl: stored.url };
}