import type { CookieOptions, Request, Response } from 'express';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { hashIp, randomToken, sha256 } from '../utils/security';

export const SESSION_COOKIE = 'kv_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function baseCookie(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    domain: env.COOKIE_DOMAIN || undefined,
  };
}

/** Creates a session, sets the cookie and returns the CSRF token for the client to keep in memory. */
export async function createSession(req: Request, res: Response, userId: string): Promise<{ csrfToken: string }> {
  const token = randomToken(32);
  const csrfSecret = randomToken(24);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      tokenHash: sha256(token),
      csrfSecret,
      userId,
      ipHash: hashIp(req.ip),
      userAgent: req.get('user-agent')?.slice(0, 255) ?? null,
      expiresAt,
    },
  });

  res.cookie(SESSION_COOKIE, token, { ...baseCookie(), expires: expiresAt });
  return { csrfToken: csrfSecret };
}

export async function destroySession(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === 'string' && token) {
    await prisma.session.updateMany({
      where: { tokenHash: sha256(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  res.clearCookie(SESSION_COOKIE, baseCookie());
}

/** Used after a password change or reset, and when an account is suspended. */
export async function revokeAllSessions(userId: string, exceptSessionId?: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null, ...(exceptSessionId ? { NOT: { id: exceptSessionId } } : {}) },
    data: { revokedAt: new Date() },
  });
}