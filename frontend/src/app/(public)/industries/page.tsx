import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { CallToAction } from '@/sections/CallToAction';
import { industriesDetail } from '@/lib/industriesDetail';

export const metadata: Metadata = {
  title: 'Industries',
  description:
    'Creator-led marketing for fashion, beauty, technology, food and beverage, travel, fitness, entertainment, automotive, e-commerce and consumer brands.',
  alternates: { canonical: '/industries' },
};

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-alt px-4 py-1.5 text-sm font-medium text-heading">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function IndustriesPage() {
  return (
    <>
      <Section className="pb-12 pt-20 md:pb-16 md:pt-28">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Industries"
              title="Creator-led marketing across sectors."
              description="Every industry has different audiences and opportunities. Here is how creator partnerships can support each one."
            />
          </Reveal>
        </Container>
      </Section>

      {industriesDetail.map((industry, index) => (
        <Section
          key={industry.slug}
          id={industry.slug}
          tone={index % 2 === 0 ? 'alt' : 'white'}
          aria-labelledby={`${industry.slug}-heading`}
          className="py-16 md:py-20"
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
              <Reveal>
                <p className="mb-4 font-serif text-sm font-semibold text-highlight">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 id={`${industry.slug}-heading`} className="text-3xl sm:text-4xl">
                  {industry.name}
                </h2>
                <p className="mt-5 text-lg leading-relaxed">{industry.introduction}</p>
                <div className="mt-8">
                  <ButtonLink href="/brand-enquiry">
                    Start an enquiry
                    <span className="sr-only"> for {industry.name}</span>
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                      Suitable creator categories
                    </h3>
                    <Chips items={industry.creatorCategories} />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                      Types of campaigns
                    </h3>
                    <Chips items={industry.campaignTypes} />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                      Marketing opportunities
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {industry.opportunities.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-highlight"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>
      ))}

      <CallToAction />
    </>
  );
}