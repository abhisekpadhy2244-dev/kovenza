export interface LegalSection {
  heading: string;
  note: string;
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

const draft = 'Text to be drafted and reviewed by a qualified lawyer before publication.';

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'How KOVÉNZA collects, uses and protects personal data.',
    sections: [
      { heading: 'Who we are and how to contact us', note: draft },
      { heading: 'What personal data we collect', note: draft },
      { heading: 'How and why we use personal data', note: draft },
      { heading: 'Sharing and international transfers', note: draft },
      { heading: 'Retention and security', note: draft },
      {
        heading: 'Your rights and data deletion requests',
        note: `${draft} The brief requires a way to request data deletion. Contact details or a request form will be linked here.`,
      },
      {
        heading: 'Applicable data protection law',
        note: `${draft} Your lawyer should consider India’s Digital Personal Data Protection rules and the laws of other countries where campaigns run.`,
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    description: 'The terms for using the KOVÉNZA website.',
    sections: [
      { heading: 'Using this website', note: draft },
      { heading: 'Intellectual property', note: draft },
      { heading: 'Limitation of liability', note: draft },
      { heading: 'Governing law and disputes', note: draft },
      { heading: 'Changes to these terms', note: draft },
    ],
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    description: 'How cookies and similar technologies are used on this website.',
    sections: [
      { heading: 'What cookies are', note: draft },
      { heading: 'Cookies we use and why', note: draft },
      { heading: 'Analytics cookies and consent', note: draft },
      { heading: 'How to manage cookies', note: draft },
    ],
  },
  {
    slug: 'creator-participation-terms',
    title: 'Creator Participation Terms',
    description: 'The terms for creators who apply to or take part in the KOVÉNZA network.',
    sections: [
      {
        heading: 'Applying and review',
        note: `${draft} Applying does not guarantee acceptance, paid opportunities, exclusive representation or a management agreement.`,
      },
      { heading: 'Eligibility', note: draft },
      { heading: 'Profile accuracy and publication', note: draft },
      { heading: 'Campaign participation and deliverables', note: draft },
      {
        heading: 'Advertising disclosure',
        note: `${draft} Your lawyer should consider the ASCI influencer advertising disclosure guidelines for campaigns in India and the rules of other countries involved.`,
      },
      { heading: 'Suspension and removal', note: draft },
    ],
  },
  {
    slug: 'brand-service-terms',
    title: 'Brand Service Terms',
    description: 'The terms for brands that use KOVÉNZA services.',
    sections: [
      { heading: 'Enquiries, briefs and scope', note: draft },
      { heading: 'Fees, budgets and payment', note: draft },
      { heading: 'Approvals and deliverables', note: draft },
      { heading: 'Content rights and usage', note: draft },
      { heading: 'Confidentiality', note: draft },
      { heading: 'Termination and liability', note: draft },
    ],
  },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}