export interface IndustryDetail {
  slug: string;
  name: string;
  introduction: string;
  creatorCategories: string[];
  campaignTypes: string[];
  opportunities: string[];
}

export const industriesDetail: IndustryDetail[] = [
  {
    slug: 'fashion-and-lifestyle',
    name: 'Fashion & Lifestyle',
    introduction:
      'Creators help fashion and lifestyle brands show products in real settings and reach audiences who follow style and everyday living.',
    creatorCategories: ['Fashion', 'Lifestyle', 'Beauty'],
    campaignTypes: ['Product launches', 'Seasonal collections', 'Creator styling content'],
    opportunities: [
      'Show collections through trusted creator voices',
      'Build visibility around launches and seasons',
      'Create styling content designed for each platform',
    ],
  },
  {
    slug: 'beauty-and-personal-care',
    name: 'Beauty & Personal Care',
    introduction:
      'Beauty and personal care brands can use creators to demonstrate products and share honest experiences with their audiences.',
    creatorCategories: ['Beauty', 'Lifestyle', 'Fashion'],
    campaignTypes: ['Product demonstrations', 'Tutorials', 'UGC reviews'],
    opportunities: [
      'Demonstrate how products are used',
      'Reach audiences interested in routines and tutorials',
      'Collect UGC that supports product storytelling',
    ],
  },
  {
    slug: 'technology',
    name: 'Technology',
    introduction:
      'Technology brands can work with creators who explain products clearly and help audiences understand what they do.',
    creatorCategories: ['Technology', 'Gaming', 'Education'],
    campaignTypes: ['Product explainers', 'App and device launches', 'Hands-on reviews'],
    opportunities: [
      'Explain features in plain, relatable language',
      'Reach audiences that follow technology and gaming',
      'Support launches with hands-on creator content',
    ],
  },
  {
    slug: 'food-and-beverage',
    name: 'Food & Beverage',
    introduction:
      'Food and beverage brands can use creators to bring products to life through recipes, tastings and local stories.',
    creatorCategories: ['Food', 'Lifestyle', 'Parenting'],
    campaignTypes: ['Recipe content', 'Product tastings', 'Local and regional promotions'],
    opportunities: [
      'Show products in real kitchens and everyday moments',
      'Reach audiences through food and family creators',
      'Support regional promotions with local voices',
    ],
  },
  {
    slug: 'travel-and-hospitality',
    name: 'Travel & Hospitality',
    introduction:
      'Travel and hospitality brands can share destinations and experiences through creators who tell visual, personal stories.',
    creatorCategories: ['Travel', 'Lifestyle', 'Food'],
    campaignTypes: ['Destination features', 'Stay and experience content', 'Itinerary storytelling'],
    opportunities: [
      'Present destinations and stays through first-hand stories',
      'Reach audiences who plan trips with creator input',
      'Create content that supports seasonal campaigns',
    ],
  },
  {
    slug: 'fitness-and-wellness',
    name: 'Fitness & Wellness',
    introduction:
      'Fitness and wellness brands can work with creators who share routines, habits and honest experiences with products and programmes.',
    creatorCategories: ['Fitness', 'Lifestyle', 'Food'],
    campaignTypes: ['Programme promotions', 'Product trials', 'Routine and habit content'],
    opportunities: [
      'Show products and programmes in everyday routines',
      'Reach communities built around health and movement',
      'Support long-term ambassador relationships',
    ],
  },
  {
    slug: 'entertainment',
    name: 'Entertainment',
    introduction:
      'Entertainment brands can use creators to build conversation around releases, events and fan communities.',
    creatorCategories: ['Entertainment', 'Gaming', 'Lifestyle'],
    campaignTypes: ['Release promotions', 'Event coverage', 'Fan community activations'],
    opportunities: [
      'Create conversation around new releases',
      'Reach fans where they already spend time',
      'Support events with creator coverage',
    ],
  },
  {
    slug: 'automotive',
    name: 'Automotive',
    introduction:
      'Automotive brands can work with creators to present vehicles and accessories through experiences audiences can picture themselves in.',
    creatorCategories: ['Technology', 'Lifestyle', 'Travel'],
    campaignTypes: ['Vehicle and accessory features', 'Launch content', 'Experience drives'],
    opportunities: [
      'Present vehicles through real driving experiences',
      'Reach audiences interested in technology and travel',
      'Support launches with creator-led content',
    ],
  },
  {
    slug: 'e-commerce',
    name: 'E-commerce',
    introduction:
      'E-commerce brands can use creators and UGC to show products clearly and give shoppers more to look at before they buy.',
    creatorCategories: ['Fashion', 'Lifestyle', 'Technology'],
    campaignTypes: ['Product promotions', 'UGC for product pages', 'Affiliate collaborations'],
    opportunities: [
      'Add creator-made content to product pages and channels',
      'Run affiliate collaborations with clear terms',
      'Promote products through relevant creator audiences',
    ],
  },
  {
    slug: 'consumer-brands',
    name: 'Consumer Brands',
    introduction:
      'Consumer brands can use creators to tell everyday product stories and build familiarity with new audiences.',
    creatorCategories: ['Lifestyle', 'Parenting', 'Food'],
    campaignTypes: ['Everyday product storytelling', 'Ambassador programmes', 'Digital activations'],
    opportunities: [
      'Tell product stories through relatable voices',
      'Build lasting relationships through ambassador programmes',
      'Run digital activations around your campaign goals',
    ],
  },
];