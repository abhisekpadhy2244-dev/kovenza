import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export default function HomePage() {
  return (
    <>
      <Section className="pb-24 pt-20 md:pb-32 md:pt-28">
        <Container>
          <Reveal>
            <p className="eyebrow mb-6">Cultivating partnerships that shape tomorrow</p>
            <h1 className="max-w-5xl text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              BRANDS <span className="text-highlight">×</span> CREATORS{' '}
              <span className="text-highlight">×</span> CULTURE.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
              We connect ambitious brands with influential creators to build meaningful collaborations,
              impactful campaigns, and lasting digital connections.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/brand-enquiry">Partner With KOVÉNZA</ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                Explore Our Ecosystem
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="alt">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Design system check"
              title="WHERE BRANDS MEET CULTURE."
              description="Temporary preview section. The full homepage arrives in Part 4."
            />
          </Reveal>
        </Container>
      </Section>

      <Section tone="dark">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Dark section"
              title="LET’S CREATE WHAT’S NEXT."
              description="Hover the buttons below: on navy they should turn light purple with navy text."
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
    </>
  );
}