import { PrismaClient } from "@prisma/client";
import { ROLE_DEFINITIONS } from "../src/config/permissions";

const prisma = new PrismaClient();

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ---- Creator categories (brief Section 5.4) -------------------------------
const CATEGORIES = [
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Travel",
  "Fitness",
  "Food",
  "Technology",
  "Gaming",
  "Entertainment",
  "Education",
  "Business",
  "Parenting",
  "Regional Creators",
];

// ---- Services (brief Sections 5.1 and 5.3). REVIEW WITH KOVÉNZA TEAM ------
const SERVICES = [
  {
    name: "Influencer Marketing",
    summary:
      "Strategy-led campaigns that connect your brand with creators whose audiences fit your goals.",
    description:
      "Campaign strategy, creator research, shortlisting, checking audience fit, coordination, briefs, execution and reporting.",
    benefits: [
      "Creators selected for audience and brand fit",
      "One coordinated team across the full campaign",
      "Reporting tied to the objectives agreed at the start",
    ],
  },
  {
    name: "Creator Partnerships",
    summary:
      "Structured collaborations between brands and creators, from one-off to long-term.",
    description:
      "Paid collaborations, endorsements, product promotions, long-term partnerships, ambassador programmes and affiliate collaborations.",
    benefits: [
      "Partnership formats matched to your objectives",
      "Clear expectations for both brand and creator",
      "Room to grow one-off work into longer relationships",
    ],
  },
  {
    name: "Brand Collaborations",
    summary:
      "Planned brand and creator relationships that build visibility, engagement and relevance.",
    description:
      "Planned brand and creator relationships that increase visibility, engagement and cultural relevance.",
    benefits: [
      "Collaborations designed around your brand story",
      "Greater visibility in the communities that matter to you",
      "Relationships built to last beyond a single post",
    ],
  },
  {
    name: "Campaign Management",
    summary:
      "End-to-end coordination so campaigns run smoothly from brief to report.",
    description:
      "Planning, choosing creators, briefs, tracking deliverables, approvals, coordinating publishing and reporting.",
    benefits: [
      "Clear timelines and tracked deliverables",
      "A structured approvals process",
      "A single point of coordination for your team",
    ],
  },
  {
    name: "Social Media Strategy",
    summary: "Platform-aware planning to help your brand show up with purpose.",
    description:
      "Content strategy, platform positioning, audience research, content calendars, growth ideas and planning.",
    benefits: [
      "A clear view of where and how to show up",
      "Content planning that supports your campaigns",
      "Strategy grounded in audience research",
    ],
  },
  {
    name: "User Generated Content (UGC)",
    summary:
      "Authentic content created by everyday creators for your brand to use.",
    description:
      "Product videos, testimonials, lifestyle content, short videos, reels and product demonstrations.",
    benefits: [
      "Authentic-feeling content for your channels",
      "A range of formats from short video to demonstrations",
      "Content that supports product storytelling",
    ],
  },
  {
    name: "Content Production",
    summary:
      "Planning and production of campaign content that fits your brand.",
    description:
      "Planning and production of creative content for brand and creator campaigns. (Draft wording: to be confirmed by the KOVÉNZA team.)",
    benefits: [
      "Content planned around campaign goals",
      "Consistent quality across deliverables",
      "Coordination between brand, creators and production",
    ],
  },
  {
    name: "Digital Campaigns",
    summary:
      "Complete online campaigns built around your goals and target audience.",
    description:
      "Complete online campaigns that match the brand’s goals and target audience.",
    benefits: [
      "Campaigns shaped around your audience",
      "Joined-up planning across platforms",
      "Objectives defined before execution begins",
    ],
  },
];

// ---- Industries (brief Section 5.6). REVIEW WITH KOVÉNZA TEAM --------------
const INDUSTRIES = [
  {
    name: "Fashion & Lifestyle",
    categories: ["Fashion", "Lifestyle", "Beauty"],
    types: [
      "Product launches",
      "Seasonal collections",
      "Creator styling content",
    ],
  },
  {
    name: "Beauty & Personal Care",
    categories: ["Beauty", "Lifestyle", "Fashion"],
    types: ["Product demonstrations", "Tutorials", "UGC reviews"],
  },
  {
    name: "Technology",
    categories: ["Technology", "Gaming", "Education"],
    types: [
      "Product explainers",
      "App and device launches",
      "Hands-on reviews",
    ],
  },
  {
    name: "Food & Beverage",
    categories: ["Food", "Lifestyle", "Parenting"],
    types: [
      "Recipe content",
      "Product tastings",
      "Local and regional promotions",
    ],
  },
  {
    name: "Travel & Hospitality",
    categories: ["Travel", "Lifestyle", "Food"],
    types: [
      "Destination features",
      "Stay and experience content",
      "Itinerary storytelling",
    ],
  },
  {
    name: "Fitness & Wellness",
    categories: ["Fitness", "Lifestyle", "Food"],
    types: [
      "Programme promotions",
      "Product trials",
      "Routine and habit content",
    ],
  },
  {
    name: "Entertainment",
    categories: ["Entertainment", "Gaming", "Lifestyle"],
    types: [
      "Release promotions",
      "Event coverage",
      "Fan community activations",
    ],
  },
  {
    name: "Automotive",
    categories: ["Technology", "Lifestyle", "Travel"],
    types: [
      "Vehicle and accessory features",
      "Launch content",
      "Experience drives",
    ],
  },
  {
    name: "E-commerce",
    categories: ["Fashion", "Lifestyle", "Technology"],
    types: [
      "Product promotions",
      "UGC for product pages",
      "Affiliate collaborations",
    ],
  },
  {
    name: "Consumer Brands",
    categories: ["Lifestyle", "Parenting", "Food"],
    types: [
      "Everyday product storytelling",
      "Ambassador programmes",
      "Digital activations",
    ],
  },
];

async function main() {
  // Roles
  for (const role of ROLE_DEFINITIONS) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: {
        name: role.name,
        description: role.description,
        isStaff: role.isStaff,
        permissions: role.permissions,
      },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
        isStaff: role.isStaff,
        permissions: role.permissions,
      },
    });
  }
  console.log(`Roles ready: ${ROLE_DEFINITIONS.length}`);

  // Categories (only create if missing, so CMS edits are never overwritten)
  for (const [index, name] of CATEGORIES.entries()) {
    const slug = slugify(name);
    await prisma.creatorCategory.upsert({
      where: { slug },
      update: {},
      create: { slug, name, sortOrder: index },
    });
  }
  console.log(`Creator categories ready: ${CATEGORIES.length}`);

  // Services
  for (const [index, service] of SERVICES.entries()) {
    const slug = slugify(service.name);
    await prisma.service.upsert({
      where: { slug },
      update: {},
      create: { slug, sortOrder: index, ...service },
    });
  }
  console.log(`Services ready: ${SERVICES.length}`);

  // Industries
  for (const [index, industry] of INDUSTRIES.entries()) {
    const slug = slugify(industry.name);
    await prisma.industry.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: industry.name,
        sortOrder: index,
        introduction: `How creator-led marketing can support brands in ${industry.name.toLowerCase()}. (Draft wording: to be reviewed by the KOVÉNZA team.)`,
        suitableCategories: industry.categories,
        campaignTypes: industry.types,
        opportunities: [
          "Reach relevant audiences through trusted creator voices",
          "Build visibility and cultural relevance for your brand",
          "Create content designed around your campaign objectives",
        ],
      },
    });
  }
  console.log(`Industries ready: ${INDUSTRIES.length}`);

  console.log(
    "Seed complete. No fake creators, brands, campaigns or results were created.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
