import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { industryNames } from '@/lib/content';

export function IndustriesStrip() {
  return (
    <Section aria-labelledby="industries-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="industries-heading"
            eyebrow="Industries"
            title="Across the sectors brands work in."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-12 flex flex-wrap gap-3">
            {industryNames.map((name) => (
              <li
                key={name}
                className="rounded-full border border-[color:var(--line)] px-5 py-3 text-[0.9375rem] font-medium text-heading"
              >
                {name}
              </li>
            ))}
          </ul>
          <Link
            href="/industries"
            className="mt-10 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-heading hover:text-highlight"
          >
            Explore industries
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}