import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { Container } from '@/components/ui/Container';
import { footerMenu, footerServices, legalLinks, siteConfig } from '@/lib/site';

const linkClass = 'text-[0.9375rem] text-dark-text/80 hover:text-dark-text hover:underline underline-offset-4';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-dark text-dark-text">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed">{siteConfig.description}</p>
            <p className="mt-5 text-sm font-semibold tracking-wide text-dark-text">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer menu">
            <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.14em]">Menu</h2>
            <ul className="space-y-3">
              {footerMenu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services">
            <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.14em]">Services</h2>
            <ul className="space-y-3">
              {footerServices.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.14em]">Connect</h2>
            <ul className="space-y-3">
              {siteConfig.email ? (
                <li>
                  <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                    {siteConfig.email}
                  </a>
                </li>
              ) : null}
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact us
                </Link>
              </li>
              {siteConfig.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} inline-flex items-center gap-1`}
                  >
                    {item.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-dark-text/80 hover:text-dark-text hover:underline underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-sm text-dark-text/80">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}