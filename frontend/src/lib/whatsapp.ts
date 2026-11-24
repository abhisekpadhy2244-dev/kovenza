import { siteConfig } from './site';

export type WhatsAppReason = 'general' | 'brand' | 'creator' | 'campaign';

const MESSAGES: Record<WhatsAppReason, string> = {
  general: 'Hello KOVÉNZA, I have a general enquiry.',
  brand: 'Hello KOVÉNZA, I’d like to discuss a brand collaboration.',
  creator: 'Hello KOVÉNZA, I have a question about applying as a creator.',
  campaign: 'Hello KOVÉNZA, I’d like to enquire about a campaign.',
};

/** Returns null when no official WhatsApp number has been configured. */
export function whatsappLink(reason: WhatsAppReason = 'general'): string | null {
  if (!siteConfig.whatsappNumber) return null;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(MESSAGES[reason])}`;
}

/** Picks a sensible pre-filled message from the current page. */
export function reasonForPath(pathname: string): WhatsAppReason {
  if (pathname.startsWith('/become-a-creator') || pathname.startsWith('/creators')) return 'creator';
  if (pathname.startsWith('/brand-enquiry') || pathname.startsWith('/our-work')) return 'campaign';
  if (pathname.startsWith('/contact') || pathname.startsWith('/services') || pathname.startsWith('/industries')) {
    return 'brand';
  }
  return 'general';
}