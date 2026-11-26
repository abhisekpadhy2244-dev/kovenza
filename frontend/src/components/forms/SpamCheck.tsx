'use client';

import type { RefObject } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

interface SpamCheckProps {
  onToken: (token: string) => void;
  turnstileRef: RefObject<TurnstileInstance | undefined>;
}

export function SpamCheck({ onToken, turnstileRef }: SpamCheckProps) {
  if (!siteKey) {
    return (
      <p className="text-sm font-medium text-[#B42318]">
        Spam protection is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in frontend/.env.local.
      </p>
    );
  }

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      options={{ theme: 'light' }}
      onSuccess={onToken}
      onExpire={() => onToken('')}
      onError={() => onToken('')}
    />
  );
}