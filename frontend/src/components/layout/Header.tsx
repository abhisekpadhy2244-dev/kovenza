'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { ButtonLink } from '@/components/ui/Button';
import { mainNav } from '@/lib/site';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-header transition-shadow duration-300',
        scrolled
          ? 'border-[color:var(--line)] shadow-[0_8px_24px_-18px_rgba(16,21,43,0.35)]'
          : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-site items-center justify-between px-5 sm:px-8 lg:px-10">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative py-2 text-[0.9375rem] font-medium text-nav hover:text-hover',
                  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-highlight after:transition-transform after:duration-300 after:content-['']",
                  'hover:after:scale-x-100',
                  active && 'text-heading after:scale-x-100',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ButtonLink href="/brand-enquiry" className="px-6">
            Partner With Us
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-heading hover:bg-alt xl:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto border-t border-[color:var(--line)] bg-header xl:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto flex max-w-site flex-col px-5 py-6 sm:px-8">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[52px] items-center border-b border-[color:var(--line)] font-serif text-2xl text-nav',
                    active && 'text-highlight',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <ButtonLink href="/brand-enquiry" className="mt-8 w-full">
              Partner With Us
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}