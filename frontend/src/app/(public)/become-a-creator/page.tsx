import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { CreatorApplicationForm } from '@/components/forms/CreatorApplicationForm';
import { FormUnavailable } from '@/components/forms/FormUnavailable';
import { getFormOptions } from '@/lib/formOptions';

export const metadata: Metadata = {
  title: 'Become a Creator',
  description: 'Apply to be part of the KOVÉNZA creator network and be considered for brand collaborations.',
  alternates: { canonical: '/become-a-creator' },
};

// The form options come from the API, so this page must not be built ahead of time.
export const dynamic = 'force-dynamic';

const steps = [
  'You submit your application and receive a reference number by email.',
  'Our team reviews every application.',
  'If your application is approved, we will email you an invitation to activate your account.',
];

export default async function BecomeACreatorPage() {
  const options = await getFormOptions();

  return (
    <Section className="pb-24 pt-20 md:pb-32 md:pt-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Become a creator"
              title="Join the KOVÉNZA creator network."
              description="Tell us about yourself and the content you make. Brands work with creators across many categories, languages and regions."
            />
            <h2 className="mt-12 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-heading">
              What happens next
            </h2>
            <ol className="mt-5 space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="font-serif text-sm font-semibold text-highlight">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-sm">
              Creators in the network are independent. Applying does not mean you will be exclusively
              represented or managed by KOVÉNZA.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-[color:var(--line)] bg-alt p-6 sm:p-10">
              {options ? <CreatorApplicationForm options={options} /> : <FormUnavailable />}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}