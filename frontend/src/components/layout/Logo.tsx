import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="KOVÉNZA home"
      className={cn(
        'font-serif text-2xl font-semibold tracking-[0.14em]',
        onDark ? 'text-dark-text' : 'text-logo',
        className,
      )}
    >
      KOVÉNZA
    </Link>
  );
}