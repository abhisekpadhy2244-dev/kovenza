import type { Request } from 'express';
import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { hashIp } from './security';

/** Records who did what and when. Logging problems never break the main request. */
export async function logActivity(params: {
  req?: Request;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
}): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        actorId: params.actorId ?? params.req?.auth?.user.id ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        metadata: params.metadata,
        ipHash: hashIp(params.req?.ip),
      },
    });
  } catch (error) {
    console.error('[activity log] failed:', error);
  }
}