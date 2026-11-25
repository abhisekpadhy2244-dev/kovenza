import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { CallToAction } from '@/sections/CallToAction';
import { servicesDetail } from '@/lib/servicesDetail';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Influencer marketing, creator partnerships, brand collaborations, campaign management, social media strategy, UGC, content production and digital campaigns.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <Section className="pb-12 pt-20 md:pb-16 md:pt-28">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Services"
              title="How we help brands and creators work well together."
              description="Eight services, each shaped around what your brand wants to achieve."
            />
          </Reveal>
        </Container>
      </Section>

      {servicesDetail.map((service, index) => {
        const reverse = index % 2 === 1;
        return (
          <Section
            key={service.slug}
            id={service.slug}
            tone={reverse ? 'alt' : 'white'}
            aria-labelledby={`${service.slug}-heading`}
            className="py-16 md:py-24"
          >
            <Container>
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <Reveal className={cn(reverse && 'lg:order-2')}>
                  <p className="mb-4 font-serif text-sm font-semibold text-highlight">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 id={`${service.slug}-heading`} className="text-3xl sm:text-4xl lg:text-5xl">
                    {service.name}
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed">{service.description}</p>

                  <h3 className="mt-8 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                    Business benefits
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3">
                        <Check size={20} className="mt-1 shrink-0 text-highlight" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <ButtonLink href="/brand-enquiry">
                      Discuss Your Project
                      <span className="sr-only"> for {service.name}</span>
                    </ButtonLink>
                  </div>
                </Reveal>

                <Reveal delay={0.1} className={cn(reverse && 'lg:order-1')}>
                  <div
                    role="img"
                    aria-label={`Illustration placeholder for ${service.name}`}
                    className="rounded-3xl border border-[color:var(--line)] bg-page p-8 sm:p-10"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-heading">
                      What it includes
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                      {service.includes.map((item) => (
                        <li
                          key={item}
                          className="rounded-full bg-alt px-4 py-2 text-sm font-medium text-heading"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 border-t border-[color:var(--line)] pt-4 text-xs">
                      Editorial photography for this service will be added once licensed images are
                      supplied.
                    </p>
                  </div>
                </Reveal>
              </div>
            </Container>
          </Section>
        );
      })}

      <CallToAction />
    </>
  );
}