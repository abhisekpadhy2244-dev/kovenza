import type { Metadata } from 'next';
import { Mail, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/lib/site';
import { whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact KOVÉNZA to discuss a brand collaboration, a campaign or the creator network.',
  alternates: { canonical: '/contact' },
};

const pending = 'To be supplied by the KOVÉNZA team';

export default function ContactPage() {
  const whatsapp = whatsappLink('brand');

  return (
    <>
      <Section className="pb-16 pt-20 md:pb-24 md:pt-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <Reveal>
              <SectionHeading
                as="h1"
                eyebrow="Contact"
                title="Let’s talk about your brand."
                description="Tell us what you want to achieve and we’ll come back to you about the next steps."
              />

              <dl className="mt-12 space-y-8">
                <div className="flex gap-4">
                  <Mail size={22} className="mt-1 shrink-0 text-highlight" aria-hidden="true" />
                  <div>
                    <dt className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                      Business email
                    </dt>
                    <dd className="mt-1">
                      {siteConfig.email ? (
                        <a href={`mailto:${siteConfig.email}`} className="text-heading underline underline-offset-4 hover:text-highlight">
                          {siteConfig.email}
                        </a>
                      ) : (
                        <span>{pending}</span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MessageCircle size={22} className="mt-1 shrink-0 text-highlight" aria-hidden="true" />
                  <div>
                    <dt className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                      WhatsApp
                    </dt>
                    <dd className="mt-1">
                      {whatsapp ? (
                        <ButtonLink href={whatsapp} variant="secondary" className="mt-2">
                          Chat on WhatsApp
                          <span className="sr-only"> (opens in a new tab)</span>
                        </ButtonLink>
                      ) : (
                        <span>{pending}</span>
                      )}
                    </dd>
                  </div>
                </div>

                {siteConfig.social.length > 0 ? (
                  <div>
                    <dt className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                      Follow us
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                      {siteConfig.social.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-heading underline underline-offset-4 hover:text-highlight"
                        >
                          {item.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-[color:var(--line)] bg-alt p-8 sm:p-10">
                <p className="eyebrow mb-3">Brand enquiry</p>
                <h2 className="text-3xl">Send us your brief.</h2>
                <p className="mt-4 leading-relaxed">
                  The enquiry form is added in the next stage of the build. Until then, please use
                  the contact details on this page.
                </p>
                <p className="mt-6 text-xs">Developer note: replaced by the Brand Enquiry form in Part 6.</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}