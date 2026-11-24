import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SectionTone = 'white' | 'alt' | 'dark';

interface SectionProps {
  tone?: SectionTone;
  id?: string;
  className?: string;
  children: ReactNode;
  'aria-labelledby'?: string;
}

const tones: Record<SectionTone, string> = {
  white: 'bg-page',
  alt: 'bg-alt',
  dark: 'bg-dark text-dark-text on-dark',
};

export function Section({ tone = 'white', id, className, children, ...rest }: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24 py-20 md:py-28', tones[tone], className)} {...rest}>
      {children}
    </section>
  );
}