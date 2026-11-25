export interface ServiceItem {
  slug: string;
  name: string;
  summary: string;
}

export const services: ServiceItem[] = [
  {
    slug: 'influencer-marketing',
    name: 'Influencer Marketing',
    summary: 'Strategy-led campaigns that connect your brand with creators whose audiences fit your goals.',
  },
  {
    slug: 'creator-partnerships',
    name: 'Creator Partnerships',
    summary: 'Structured collaborations between brands and creators, from one-off to long-term.',
  },
  {
    slug: 'brand-collaborations',
    name: 'Brand Collaborations',
    summary: 'Planned brand and creator relationships that build visibility, engagement and relevance.',
  },
  {
    slug: 'campaign-management',
    name: 'Campaign Management',
    summary: 'End-to-end coordination so campaigns run smoothly from brief to report.',
  },
  {
    slug: 'social-media-strategy',
    name: 'Social Media Strategy',
    summary: 'Platform-aware planning to help your brand show up with purpose.',
  },
  {
    slug: 'user-generated-content-ugc',
    name: 'User Generated Content (UGC)',
    summary: 'Authentic content created by everyday creators for your brand to use.',
  },
  {
    slug: 'content-production',
    name: 'Content Production',
    summary: 'Planning and production of campaign content that fits your brand.',
  },
  {
    slug: 'digital-campaigns',
    name: 'Digital Campaigns',
    summary: 'Complete online campaigns built around your goals and target audience.',
  },
];

export interface WhyPoint {
  title: string;
  text: string;
}

export const whyKovenza: WhyPoint[] = [
  {
    title: 'Strategic creator selection',
    text: 'We look at audience fit and brand relevance before any creator is suggested.',
  },
  {
    title: 'Brand-aligned partnerships',
    text: 'Collaborations are shaped around your brand story, not the other way round.',
  },
  {
    title: 'Creative thinking',
    text: 'Ideas that feel natural to the creator and relevant to their audience.',
  },
  {
    title: 'Professional coordination',
    text: 'Briefs, timelines, approvals and publishing are organised in one place.',
  },
  {
    title: 'Cultural relevance',
    text: 'We pay attention to the communities and conversations your brand wants to join.',
  },
  {
    title: 'Measurable objectives',
    text: 'Goals are agreed at the start, so results can be reviewed against them.',
  },
];

export const industryNames: string[] = [
  'Fashion & Lifestyle',
  'Beauty & Personal Care',
  'Technology',
  'Food & Beverage',
  'Travel & Hospitality',
  'Fitness & Wellness',
  'Entertainment',
  'Automotive',
  'E-commerce',
  'Consumer Brands',
];