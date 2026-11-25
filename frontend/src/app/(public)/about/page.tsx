import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Card } from '@/components/ui/Card';
import { CallToAction } from '@/sections/CallToAction';

export const metadata: Metadata = {
  title: 'About KOVÉNZA',
  description:
    'KOVÉNZA connects brands with creators, influencers, content producers and digital communities to develop meaningful marketing collaborations.',
  alternates: { canonical: '/about' },
};

const values = [
  'Creativity',
  'Integrity',
  'Innovation',
  'Collaboration',
  'Transparency',
  'Excellence',
  'Cultural relevance',
];

const approach = [
  {
    title: 'Understand the brand',
    text: 'We start with your goals, audience and the story you want to tell.',
  },
  {
    title: 'Find the right voices',
    text: 'We look for creators whose audiences and style fit the brand.',
  },
  {
    title: 'Shape the partnership',
    text: 'Briefs, deliverables and timelines are agreed clearly before work begins.',
  },
  {
    title: 'Coordinate and review',
    text: 'We help manage the work through to publishing and review it against the objectives.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Section className="pb-16 pt-20 md:pb-20 md:pt-28">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="About KOVÉNZA"
              title="Who we are."
              description="KOVÉNZA connects brands with creators, influencers, content producers and digital communities to develop meaningful marketing collaborations and campaigns. Brands are our primary partners, and creators are part of the wider partnership ecosystem we work with."
            />
          </Reveal>
        </Container>
      </Section>

      <Section tone="alt" aria-labelledby="story-heading">
        <Container>
          <Reveal>
            <SectionHeading id="story-heading" eyebrow="Our Story" title="How KOVÉNZA began." />
            <div className="mt-8 max-w-3xl rounded-2xl border border-dashed border-heading/30 bg-page p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-heading">
                Content pending
              </p>
              <p className="mt-3 text-lg leading-relaxed">
                The KOVÉNZA team will supply the Our Story text. This section will be editable from
                the admin dashboard.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section aria-labelledby="vision-heading">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow mb-4">Vision</p>
              <h2 id="vision-heading" className="text-3xl sm:text-4xl">
                Where we want to go.
              </h2>
              <p className="mt-6 text-lg leading-relaxed">
                To become a trusted global partner in the evolving creator economy, shaping meaningful
                connections between brands, creators, and culture.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="eyebrow mb-4">Mission</p>
              <h2 className="text-3xl sm:text-4xl">What we do about it.</h2>
              <p className="mt-6 text-lg leading-relaxed">
                To help brands connect with the right voices, create relevant digital experiences, and
                develop partnerships that deliver lasting value.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="alt" aria-labelledby="values-heading">
        <Container>
          <Reveal>
            <SectionHeading id="values-heading" eyebrow="Values" title="What guides our work." />
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-12 flex flex-wrap gap-3">
              {values.map((value) => (
                <li
                  key={value}
                  className="rounded-full border border-heading/20 bg-page px-6 py-3 text-base font-medium text-heading"
                >
                  {value}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <Section aria-labelledby="approach-heading">
        <Container>
          <Reveal>
            <SectionHeading id="approach-heading" eyebrow="Our Approach" title="A clear, simple process." />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06}>
                <Card className="h-full">
                  <p className="mb-4 font-serif text-sm font-semibold text-highlight">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-xl">{step.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed">{step.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}