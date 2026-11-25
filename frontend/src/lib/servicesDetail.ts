export interface ServiceDetail {
  slug: string;
  name: string;
  description: string;
  includes: string[];
  benefits: string[];
}

export const servicesDetail: ServiceDetail[] = [
  {
    slug: 'influencer-marketing',
    name: 'Influencer Marketing',
    description:
      'Strategy-led campaigns that connect your brand with creators whose audiences fit your goals.',
    includes: [
      'Campaign strategy',
      'Creator research',
      'Shortlisting',
      'Checking audience fit',
      'Coordination',
      'Briefs and execution',
      'Reporting',
    ],
    benefits: [
      'Creators selected for audience and brand fit',
      'One coordinated team across the full campaign',
      'Reporting tied to the objectives agreed at the start',
    ],
  },
  {
    slug: 'creator-partnerships',
    name: 'Creator Partnerships',
    description: 'Structured collaborations between brands and creators, from one-off to long-term.',
    includes: [
      'Paid collaborations',
      'Endorsements',
      'Product promotions',
      'Long-term partnerships',
      'Ambassador programmes',
      'Affiliate collaborations',
    ],
    benefits: [
      'Partnership formats matched to your objectives',
      'Clear expectations for brand and creator',
      'Room to grow one-off work into longer relationships',
    ],
  },
  {
    slug: 'brand-collaborations',
    name: 'Brand Collaborations',
    description:
      'Planned brand and creator relationships that increase visibility, engagement and relevance.',
    includes: [
      'Collaboration planning',
      'Brand and creator matching',
      'Visibility and engagement focus',
    ],
    benefits: [
      'Collaborations designed around your brand story',
      'Greater visibility in the communities that matter to you',
      'Relationships built to last beyond a single post',
    ],
  },
  {
    slug: 'campaign-management',
    name: 'Campaign Management',
    description: 'End-to-end coordination so campaigns run smoothly from brief to report.',
    includes: [
      'Planning',
      'Choosing creators',
      'Briefs',
      'Tracking deliverables',
      'Approvals',
      'Coordinating publishing',
      'Reporting',
    ],
    benefits: [
      'Clear timelines and tracked deliverables',
      'A structured approvals process',
      'A single point of coordination for your team',
    ],
  },
  {
    slug: 'social-media-strategy',
    name: 'Social Media Strategy',
    description: 'Platform-aware planning to help your brand show up with purpose.',
    includes: [
      'Content strategy',
      'Platform positioning',
      'Audience research',
      'Content calendars',
      'Growth ideas',
      'Planning',
    ],
    benefits: [
      'A clear view of where and how to show up',
      'Content planning that supports your campaigns',
      'Strategy grounded in audience research',
    ],
  },
  {
    slug: 'user-generated-content-ugc',
    name: 'User Generated Content (UGC)',
    description: 'Authentic content created by everyday creators for your brand to use.',
    includes: [
      'Product videos',
      'Testimonials',
      'Lifestyle content',
      'Short videos and reels',
      'Product demonstrations',
    ],
    benefits: [
      'Authentic-feeling content for your channels',
      'A range of formats from short video to demonstrations',
      'Content that supports product storytelling',
    ],
  },
  {
    slug: 'content-production',
    name: 'Content Production',
    description: 'Planning and production of campaign content that fits your brand.',
    includes: ['Content planning', 'Creative production', 'Coordination with creators'],
    benefits: [
      'Content planned around campaign goals',
      'Consistent quality across deliverables',
      'Coordination between brand, creators and production',
    ],
  },
  {
    slug: 'digital-campaigns',
    name: 'Digital Campaigns',
    description: 'Complete online campaigns built around your goals and target audience.',
    includes: ['Campaign planning', 'Audience targeting', 'Multi-platform coordination'],
    benefits: [
      'Campaigns shaped around your audience',
      'Joined-up planning across platforms',
      'Objectives defined before execution begins',
    ],
  },
];