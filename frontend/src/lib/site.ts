export const siteConfig = {
  name: 'KOVÉNZA',
  tagline: 'BRANDS × CREATORS × CULTURE.',
  secondaryTagline: 'Cultivating partnerships that shape tomorrow.',
  description:
    'KOVÉNZA connects brands with creators, influencers, content producers and digital communities to develop meaningful marketing collaborations and campaigns.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || '',
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  social: [
    { label: 'Instagram', href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '' },
    { label: 'LinkedIn', href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '' },
    { label: 'YouTube', href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '' },
    { label: 'X', href: process.env.NEXT_PUBLIC_SOCIAL_X || '' },
  ].filter((item) => item.href),
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Creators', href: '/creators' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact', href: '/contact' },
  { label: 'Login', href: '/login' },
];

export const footerMenu: NavItem[] = [
  ...mainNav.filter((item) => item.href !== '/login'),
  { label: 'Become a Creator', href: '/become-a-creator' },
  { label: 'Brand Enquiry', href: '/brand-enquiry' },
];

export const footerServices: NavItem[] = [
  { label: 'Influencer Marketing', href: '/services#influencer-marketing' },
  { label: 'Creator Partnerships', href: '/services#creator-partnerships' },
  { label: 'Brand Collaborations', href: '/services#brand-collaborations' },
  { label: 'Campaign Management', href: '/services#campaign-management' },
  { label: 'Social Media Strategy', href: '/services#social-media-strategy' },
  { label: 'User Generated Content (UGC)', href: '/services#user-generated-content-ugc' },
  { label: 'Content Production', href: '/services#content-production' },
  { label: 'Digital Campaigns', href: '/services#digital-campaigns' },
];

export const legalLinks: NavItem[] = [
  { label: 'Privacy Policy', href: '/legal/privacy-policy' },
  { label: 'Terms & Conditions', href: '/legal/terms-and-conditions' },
  { label: 'Cookie Policy', href: '/legal/cookie-policy' },
  { label: 'Creator Participation Terms', href: '/legal/creator-participation-terms' },
  { label: 'Brand Service Terms', href: '/legal/brand-service-terms' },
];