import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<void> {
  if (env.isTest) return;

  if (!env.TURNSTILE_SECRET_KEY) {
    // Production refuses to start without the key (see config/env.ts), so this is development only.
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set; skipping spam check (development only).');
    return;
  }

  if (!token) {
    throw new HttpError(400, 'Please complete the spam check and try again.', 'SPAM_CHECK');
  }

  let outcome: { success?: boolean };
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
    if (ip) body.set('remoteip', ip);
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    });
    outcome = (await response.json()) as { success?: boolean };
  } catch (error) {
    console.error('[turnstile] verification request failed:', error);
    throw new HttpError(503, 'We could not run the spam check. Please try again in a moment.', 'SPAM_CHECK_UNAVAILABLE');
  }

  if (!outcome.success) {
    throw new HttpError(400, 'The spam check failed. Please try again.', 'SPAM_CHECK');
  }
}