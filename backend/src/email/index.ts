import { env } from '../config/env';
import { ConsoleProvider } from './console';
import { ResendProvider } from './resend';
import type { EmailMessage, EmailProvider } from './provider';

function createProvider(): EmailProvider {
  if (env.EMAIL_PROVIDER === 'resend' && env.RESEND_API_KEY) {
    return new ResendProvider(env.RESEND_API_KEY, env.EMAIL_FROM);
  }
  return new ConsoleProvider();
}

export const emailProvider: EmailProvider = createProvider();

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (env.isTest) return true;
  try {
    await emailProvider.send(message);
    return true;
  } catch (error) {
    console.error(`[email] failed via ${emailProvider.name}:`, error);
    return false;
  }
}

export type { EmailMessage, EmailProvider } from './provider';