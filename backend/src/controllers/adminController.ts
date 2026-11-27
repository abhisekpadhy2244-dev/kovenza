import { prisma } from '../config/prisma';
import type { Permission } from '../config/permissions';
import { asyncHandler } from '../utils/asyncHandler';

const PENDING_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED'] as const;

/** Each figure is only returned if the user's role may see it. Hidden figures are null. */
export const getOverview = asyncHandler(async (req, res) => {
  const granted = new Set(req.auth!.user.permissions);
  const can = (permission: Permission) => granted.has(permission);

  const [
    brands,
    creatorApplications,
    approvedCreators,
    pendingApplications,
    enquiries,
    activeCampaigns,
    completedCampaigns,
    recent,
  ] = await Promise.all([
    can('brands:read') ? prisma.brandAccount.count() : null,
    can('creators:read') ? prisma.creatorApplication.count() : null,
    can('creators:read') ? prisma.creatorProfile.count({ where: { status: 'APPROVED' } }) : null,
    can('creators:read')
      ? prisma.creatorApplication.count({ where: { status: { in: [...PENDING_STATUSES] } } })
      : null,
    can('enquiries:read') ? prisma.brandEnquiry.count() : null,
    can('campaigns:read') ? prisma.campaign.count({ where: { status: 'ACTIVE' } }) : null,
    can('campaigns:read') ? prisma.campaign.count({ where: { status: 'COMPLETED' } }) : null,
    can('activity:read')
      ? prisma.activityLog.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { actor: { select: { fullName: true } } },
        })
      : null,
  ]);

  res.set('Cache-Control', 'no-store');
  res.json({
    stats: {
      brands,
      creatorApplications,
      approvedCreators,
      pendingApplications,
      enquiries,
      activeCampaigns,
      completedCampaigns,
    },
    recentActivity:
      recent?.map((item) => ({
        id: item.id,
        action: item.action,
        entityType: item.entityType,
        actorName: item.actor?.fullName ?? null,
        createdAt: item.createdAt,
      })) ?? null,
  });
});