import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary';

interface StyleOptions {
  variant?: Variant;
  onDark?: boolean;
  className?: string;
}

export function buttonClasses({ variant = 'primary', onDark = false, className }: StyleOptions): string {
  const base =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-[0.9375rem] font-semibold leading-none transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

  const styles: Record<Variant, string> = {
    primary: onDark
      ? 'bg-button text-button-text hover:bg-decor hover:text-hover'
      : 'bg-button text-button-text hover:bg-hover',
    secondary: onDark
      ? 'border border-dark-text text-dark-text hover:border-decor hover:bg-decor hover:text-hover'
      : 'border border-heading text-heading hover:bg-hover hover:text-button-text',
  };

  return cn(base, styles[variant], className);
}

type ButtonProps = StyleOptions &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { children: ReactNode };

export function Button({ variant, onDark, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, onDark, className })} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = StyleOptions &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> & {
    href: string;
    children: ReactNode;
  };

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/i.test(href);

export function ButtonLink({ variant, onDark, className, href, children, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, onDark, className });

  if (isExternal(href)) {
    const opensNewTab = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(opensNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}