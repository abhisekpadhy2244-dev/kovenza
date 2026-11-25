import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function Introduction() {
  return (
    <Section tone="alt" aria-labelledby="intro-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading id="intro-heading" eyebrow="Who we are" title="WHERE BRANDS MEET CULTURE." />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed">
              <p>
                KOVÉNZA connects brands with creators, influencers, content producers and digital
                communities to develop meaningful marketing collaborations and campaigns.
              </p>
              <p>
                Brands tell us what they want to achieve. We help find the right voices, shape the
                partnership and coordinate the work, so the result feels relevant to the audience it
                is made for.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}