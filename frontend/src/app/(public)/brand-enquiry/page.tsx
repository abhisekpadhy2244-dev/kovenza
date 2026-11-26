import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { BrandEnquiryForm } from '@/components/forms/BrandEnquiryForm';
import { FormUnavailable } from '@/components/forms/FormUnavailable';
import { getFormOptions } from '@/lib/formOptions';

export const metadata: Metadata = {
  title: 'Brand Enquiry',
  description: 'Tell KOVÉNZA about your brand and campaign goals to start a creator partnership enquiry.',
  alternates: { canonical: '/brand-enquiry' },
};

// The form options come from the API, so this page must not be built ahead of time.
export const dynamic = 'force-dynamic';

const steps = [
  'You send us your enquiry and receive a reference number by email.',
  'Our team reviews your goals, industry, audience and timeline.',
  'We get in touch about the next steps.',
];

export default async function BrandEnquiryPage() {
  const options = await getFormOptions();

  return (
    <Section className="pb-24 pt-20 md:pb-32 md:pt-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Brand enquiry"
              title="Partner with KOVÉNZA."
              description="Tell us about your brand and what you want to achieve. The more detail you share, the better we can prepare."
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
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-[color:var(--line)] bg-alt p-6 sm:p-10">
              {options ? <BrandEnquiryForm options={options} /> : <FormUnavailable />}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}