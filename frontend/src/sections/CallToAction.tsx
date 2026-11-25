import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function CallToAction() {
  return (
    <Section tone="dark" aria-labelledby="cta-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="cta-heading"
            eyebrow="Get started"
            title="LET’S CREATE WHAT’S NEXT."
            description="Tell us what your brand wants to achieve, or apply to be part of our creator network."
          />
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/brand-enquiry" onDark>
              I’m a Brand
            </ButtonLink>
            <ButtonLink href="/become-a-creator" variant="secondary" onDark>
              I’m a Creator
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}