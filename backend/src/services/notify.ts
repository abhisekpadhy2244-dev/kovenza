import { env } from '../config/env';
import { sendEmail } from '../email';
import type { RenderedEmail } from '../email/templates';

/** Fire-and-forget: the submission is already saved, so email trouble must never fail the request. */
export function emailAdmins(email: RenderedEmail, replyTo?: string): void {
  if (env.adminNotifyEmails.length === 0) {
    console.warn('[email] ADMIN_NOTIFY_EMAILS is empty, so no admin notification was sent.');
    return;
  }
  void sendEmail({ to: env.adminNotifyEmails, replyTo, ...email });
}

export function emailPerson(to: string, email: RenderedEmail): void {
  void sendEmail({ to, replyTo: env.BUSINESS_EMAIL, ...email });
}