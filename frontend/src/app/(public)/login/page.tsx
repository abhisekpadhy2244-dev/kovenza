import type { Metadata } from 'next';
import { Building2, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to the KOVÉNZA Brand Portal or Creator Portal.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Section className="pb-24 pt-20 md:pb-32 md:pt-28">
      <Container>
        <Reveal>
          <SectionHeading
            as="h1"
            align="center"
            eyebrow="Login"
            title="Welcome to KOVÉNZA."
            description="Choose the portal that fits you. The Brand Portal and Creator Portal are separate spaces."
          />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-[color:var(--line)] p-8">
              <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-alt text-highlight">
                <Building2 size={22} aria-hidden="true" />
              </span>
              <h2 className="text-2xl">I’m a Brand</h2>
              <p className="mt-3 flex-1 leading-relaxed">
                The Brand Portal is opening soon. In the meantime, send us your campaign enquiry.
              </p>
              <p className="mt-6 text-sm font-semibold text-heading">Portal opening soon</p>
              <ButtonLink href="/brand-enquiry" className="mt-4">
                Start a brand enquiry
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-[color:var(--line)] p-8">
              <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-alt text-highlight">
                <Sparkles size={22} aria-hidden="true" />
              </span>
              <h2 className="text-2xl">I’m a Creator</h2>
              <p className="mt-3 flex-1 leading-relaxed">
                The Creator Portal is for approved creators and opens soon. You can apply to join the
                network now.
              </p>
              <p className="mt-6 text-sm font-semibold text-heading">Portal opening soon</p>
              <ButtonLink href="/become-a-creator" variant="secondary" className="mt-4">
                Become a creator
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}