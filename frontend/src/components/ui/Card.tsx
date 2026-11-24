import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[color:var(--line)] bg-page p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-decor hover:shadow-[0_12px_32px_-16px_rgba(16,21,43,0.25)] sm:p-8',
        className,
      )}
      {...rest}
    />
  );
}