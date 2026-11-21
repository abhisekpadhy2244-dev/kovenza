export const PERMISSIONS = [
  "creators:read",
  "creators:review",
  "creators:edit",
  "creators:publish",
  "creators:suspend",
  "brands:read",
  "brands:manage",
  "enquiries:read",
  "enquiries:manage",
  "enquiries:export",
  "campaigns:read",
  "campaigns:manage",
  "content:manage",
  "seo:manage",
  "users:manage",
  "activity:read",
  "privacy:manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type RoleKeyName =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CAMPAIGN_MANAGER"
  | "CONTENT_MANAGER"
  | "CREATOR"
  | "BRAND";

export interface RoleDefinition {
  key: RoleKeyName;
  name: string;
  description: string;
  isStaff: boolean;
  permissions: Permission[];
}

// Suggested split from the brief (Section 9). To be confirmed with KOVÉNZA.
export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    key: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Everything, including managing other admins and roles.",
    isStaff: true,
    permissions: [...PERMISSIONS],
  },
  {
    key: "ADMIN",
    name: "Admin",
    description: "Creators, brands, enquiries, campaigns and website content.",
    isStaff: true,
    permissions: PERMISSIONS.filter((p) => p !== "users:manage"),
  },
  {
    key: "CAMPAIGN_MANAGER",
    name: "Campaign Manager",
    description: "Campaigns, enquiries, and viewing creators and brands.",
    isStaff: true,
    permissions: [
      "campaigns:read",
      "campaigns:manage",
      "enquiries:read",
      "enquiries:manage",
      "enquiries:export",
      "creators:read",
      "brands:read",
    ],
  },
  {
    key: "CONTENT_MANAGER",
    name: "Content Manager",
    description: "Website content, case studies, images and SEO only.",
    isStaff: true,
    permissions: ["content:manage", "seo:manage"],
  },
  {
    key: "CREATOR",
    name: "Creator",
    description: "Approved creator portal user.",
    isStaff: false,
    permissions: [],
  },
  {
    key: "BRAND",
    name: "Brand",
    description: "Brand portal user.",
    isStaff: false,
    permissions: [],
  },
];
