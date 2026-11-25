import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { whyKovenza } from '@/lib/content';

export function WhyKovenza() {
  return (
    <Section tone="alt" aria-labelledby="why-heading">
      <Container>
        <Reveal>
          <SectionHeading id="why-heading" eyebrow="Why KOVÉNZA" title="A considered way to work with creators." />
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {whyKovenza.map((point, index) => (
            <Reveal key={point.title} delay={(index % 3) * 0.06}>
              <div className="border-t border-heading pt-6">
                <p className="mb-3 font-serif text-sm font-semibold text-highlight">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="text-2xl">{point.title}</h3>
                <p className="mt-3 leading-relaxed">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}