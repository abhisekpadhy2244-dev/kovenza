'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { reasonForPath, whatsappLink } from '@/lib/whatsapp';

export function WhatsAppButton() {
  const pathname = usePathname();
  const href = whatsappLink(reasonForPath(pathname));

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with KOVÉNZA on WhatsApp (opens in a new tab)"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-button text-button-text shadow-[0_10px_30px_-8px_rgba(16,21,43,0.5)] transition-colors duration-200 hover:bg-hover sm:bottom-7 sm:right-7"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}