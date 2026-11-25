import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TriangleAlert } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getLegalDocument, legalDocuments } from '@/lib/legal';

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocuments.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDocument(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/legal/${doc.slug}` },
    // Remove this line once lawyer-reviewed text is published.
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDocument(slug);
  if (!doc) notFound();

  return (
    <Section className="pb-24 pt-20 md:pb-32 md:pt-28">
      <Container>
        <SectionHeading as="h1" eyebrow="Legal" title={doc.title} description={doc.description} />

        <div
          role="note"
          className="mt-10 flex max-w-3xl gap-4 rounded-2xl border border-heading/30 bg-alt p-6"
        >
          <TriangleAlert size={22} className="mt-0.5 shrink-0 text-heading" aria-hidden="true" />
          <p className="text-heading">
            <strong>Template only.</strong> This page has not been reviewed or approved by a lawyer.
            Qualified legal review is required before publication.
          </p>
        </div>

        <div className="mt-12 max-w-3xl space-y-10">
          {doc.sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="text-2xl">
                {index + 1}. {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed">{section.note}</p>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}