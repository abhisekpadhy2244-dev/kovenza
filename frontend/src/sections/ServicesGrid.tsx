import Link from 'next/link';
import {
  ArrowRight,
  ClipboardList,
  Clapperboard,
  Globe,
  Link2,
  Megaphone,
  Share2,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { services } from '@/lib/content';

const icons: Record<string, LucideIcon> = {
  'influencer-marketing': Megaphone,
  'creator-partnerships': Users,
  'brand-collaborations': Link2,
  'campaign-management': ClipboardList,
  'social-media-strategy': Share2,
  'user-generated-content-ugc': Video,
  'content-production': Clapperboard,
  'digital-campaigns': Globe,
};

export function ServicesGrid() {
  return (
    <Section aria-labelledby="services-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title="What we do for brands."
            description="Eight ways we help brands and creators work well together."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = icons[service.slug] ?? Megaphone;
            return (
              <Reveal key={service.slug} delay={(index % 4) * 0.06}>
                <Card className="flex h-full flex-col">
                  <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-alt text-highlight">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl">{service.name}</h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed">{service.summary}</p>
                  <Link
                    href={`/services#${service.slug}`}
                    className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-heading hover:text-highlight"
                  >
                    Learn more
                    <ArrowRight size={16} aria-hidden="true" />
                    <span className="sr-only">about {service.name}</span>
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}