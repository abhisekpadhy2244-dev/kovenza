-- CreateEnum
CREATE TYPE "RoleKey" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'CAMPAIGN_MANAGER', 'CONTENT_MANAGER', 'CREATOR', 'BRAND');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'CREATOR_INVITATION');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('DRAFT', 'APPROVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED', 'SPAM');

-- CreateEnum
CREATE TYPE "BriefStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED', 'APPROVED', 'REJECTED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignCreatorStatus" AS ENUM ('INVITED', 'INVITE_ACCEPTED', 'INVITE_DECLINED', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'NOT_SELECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "DeliverableStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'REVISION_REQUESTED', 'APPROVED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'X', 'LINKEDIN', 'SNAPCHAT', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetKind" AS ENUM ('IMAGE', 'DOCUMENT', 'VIDEO');

-- CreateEnum
CREATE TYPE "AssetPurpose" AS ENUM ('PROFILE_PHOTO', 'PORTFOLIO', 'MEDIA_KIT', 'CASE_STUDY_MEDIA', 'SERVICE_IMAGE', 'SITE_IMAGE', 'CAMPAIGN_REFERENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GENERAL', 'APPLICATION_UPDATE', 'CAMPAIGN_INVITATION', 'ENQUIRY_UPDATE', 'BRIEF_UPDATE', 'ACCOUNT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "DeletionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "key" "RoleKey" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "permissions" TEXT[],
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "roleId" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "emailVerifiedAt" TIMESTAMPTZ(3),
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMPTZ(3),
    "lastLoginAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "csrfSecret" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "translations" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CreatorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "benefits" TEXT[],
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "translations" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "suitableCategories" TEXT[],
    "campaignTypes" TEXT[],
    "opportunities" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "translations" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorApplication" (
    "id" TEXT NOT NULL,
    "applicationCode" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ageConfirmed" BOOLEAN NOT NULL,
    "instagram" TEXT,
    "youtube" TEXT,
    "tiktok" TEXT,
    "otherSocials" TEXT,
    "categoryId" TEXT NOT NULL,
    "audienceSize" INTEGER,
    "languages" TEXT[],
    "biography" TEXT NOT NULL,
    "collaborationInterests" TEXT NOT NULL,
    "consentPrivacy" BOOLEAN NOT NULL,
    "consentAt" TIMESTAMPTZ(3) NOT NULL,
    "ipHash" TEXT,
    "reviewMessage" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMPTZ(3),
    "invitedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CreatorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorProfile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "displayName" TEXT NOT NULL,
    "shortIntro" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "niches" TEXT[],
    "country" TEXT NOT NULL,
    "city" TEXT,
    "languages" TEXT[],
    "audienceSize" INTEGER,
    "audienceVerified" BOOLEAN NOT NULL DEFAULT false,
    "collaborationInterests" TEXT,
    "status" "ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "handle" TEXT,
    "url" TEXT NOT NULL,
    "followerCount" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMPTZ(3),
    "verifiedById" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "website" TEXT,
    "country" TEXT NOT NULL,
    "industryId" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "status" "BrandStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMPTZ(3),
    "verifiedById" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "BrandAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandEnquiry" (
    "id" TEXT NOT NULL,
    "enquiryCode" TEXT NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "fullName" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "budgetRange" TEXT,
    "timeline" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "consentPrivacy" BOOLEAN NOT NULL,
    "consentAt" TIMESTAMPTZ(3) NOT NULL,
    "ipHash" TEXT,
    "source" TEXT,
    "assignedToId" TEXT,
    "followUpAt" TIMESTAMPTZ(3),
    "brandAccountId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "BrandEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignBrief" (
    "id" TEXT NOT NULL,
    "briefCode" TEXT NOT NULL,
    "brandAccountId" TEXT NOT NULL,
    "status" "BriefStatus" NOT NULL DEFAULT 'SUBMITTED',
    "campaignName" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "creatorCategories" TEXT[],
    "platforms" "SocialPlatform"[],
    "creatorCount" INTEGER NOT NULL,
    "deliverables" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "deadlineAt" TIMESTAMPTZ(3),
    "timeZone" TEXT,
    "budgetMin" DECIMAL(14,2),
    "budgetMax" DECIMAL(14,2),
    "budgetCurrency" VARCHAR(3),
    "additionalRequirements" TEXT,
    "reviewMessage" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CampaignBrief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "campaignCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objective" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "brandAccountId" TEXT,
    "briefId" TEXT,
    "enquiryId" TEXT,
    "managerId" TEXT,
    "startsAt" TIMESTAMPTZ(3),
    "endsAt" TIMESTAMPTZ(3),
    "timeZone" TEXT,
    "budgetAmount" DECIMAL(14,2),
    "budgetCurrency" VARCHAR(3),
    "outcomeSummary" TEXT,
    "outcomeMetrics" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignCreator" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "status" "CampaignCreatorStatus" NOT NULL DEFAULT 'INVITED',
    "message" TEXT,
    "feeAmount" DECIMAL(14,2),
    "feeCurrency" VARCHAR(3),
    "invitedAt" TIMESTAMPTZ(3),
    "respondedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CampaignCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "campaignCreatorId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "platform" "SocialPlatform",
    "status" "DeliverableStatus" NOT NULL DEFAULT 'PENDING',
    "dueAt" TIMESTAMPTZ(3),
    "timeZone" TEXT,
    "submissionUrl" TEXT,
    "approvedAt" TIMESTAMPTZ(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" TEXT NOT NULL,
    "brandAccountId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "campaignId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "industryId" TEXT,
    "goal" TEXT,
    "overview" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "creatorSelection" TEXT NOT NULL,
    "execution" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "creatorCategories" TEXT[],
    "deliverables" TEXT[],
    "verifiedResults" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "campaignId" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "translations" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "data" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "updatedById" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WebsiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSeo" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ogImageUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PageSeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "company" TEXT,
    "quote" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedAsset" (
    "id" TEXT NOT NULL,
    "kind" "AssetKind" NOT NULL,
    "purpose" "AssetPurpose" NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'cloudinary',
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "originalName" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedById" TEXT,
    "creatorProfileId" TEXT,
    "creatorApplicationId" TEXT,
    "caseStudyId" TEXT,
    "campaignId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "enquiryId" TEXT,
    "creatorApplicationId" TEXT,
    "creatorProfileId" TEXT,
    "brandAccountId" TEXT,
    "campaignId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'GENERAL',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "readAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipHash" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletionRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "details" TEXT,
    "status" "DeletionStatus" NOT NULL DEFAULT 'PENDING',
    "handledById" TEXT,
    "handledAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_tokenHash_key" ON "AuthToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthToken_userId_type_idx" ON "AuthToken"("userId", "type");

-- CreateIndex
CREATE INDEX "AuthToken_expiresAt_idx" ON "AuthToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorCategory_slug_key" ON "CreatorCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorApplication_applicationCode_key" ON "CreatorApplication"("applicationCode");

-- CreateIndex
CREATE INDEX "CreatorApplication_email_idx" ON "CreatorApplication"("email");

-- CreateIndex
CREATE INDEX "CreatorApplication_status_createdAt_idx" ON "CreatorApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CreatorApplication_categoryId_idx" ON "CreatorApplication"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_slug_key" ON "CreatorProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_applicationId_key" ON "CreatorProfile"("applicationId");

-- CreateIndex
CREATE INDEX "CreatorProfile_status_isPublished_idx" ON "CreatorProfile"("status", "isPublished");

-- CreateIndex
CREATE INDEX "CreatorProfile_categoryId_idx" ON "CreatorProfile"("categoryId");

-- CreateIndex
CREATE INDEX "CreatorProfile_country_idx" ON "CreatorProfile"("country");

-- CreateIndex
CREATE INDEX "SocialAccount_platform_idx" ON "SocialAccount"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_profileId_url_key" ON "SocialAccount"("profileId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "BrandAccount_userId_key" ON "BrandAccount"("userId");

-- CreateIndex
CREATE INDEX "BrandAccount_status_idx" ON "BrandAccount"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BrandEnquiry_enquiryCode_key" ON "BrandEnquiry"("enquiryCode");

-- CreateIndex
CREATE INDEX "BrandEnquiry_status_createdAt_idx" ON "BrandEnquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BrandEnquiry_businessEmail_idx" ON "BrandEnquiry"("businessEmail");

-- CreateIndex
CREATE INDEX "BrandEnquiry_assignedToId_idx" ON "BrandEnquiry"("assignedToId");

-- CreateIndex
CREATE INDEX "BrandEnquiry_followUpAt_idx" ON "BrandEnquiry"("followUpAt");

-- CreateIndex
CREATE INDEX "BrandEnquiry_brandAccountId_idx" ON "BrandEnquiry"("brandAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignBrief_briefCode_key" ON "CampaignBrief"("briefCode");

-- CreateIndex
CREATE INDEX "CampaignBrief_brandAccountId_idx" ON "CampaignBrief"("brandAccountId");

-- CreateIndex
CREATE INDEX "CampaignBrief_status_createdAt_idx" ON "CampaignBrief"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaignCode_key" ON "Campaign"("campaignCode");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_briefId_key" ON "Campaign"("briefId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_brandAccountId_idx" ON "Campaign"("brandAccountId");

-- CreateIndex
CREATE INDEX "Campaign_managerId_idx" ON "Campaign"("managerId");

-- CreateIndex
CREATE INDEX "CampaignCreator_creatorProfileId_status_idx" ON "CampaignCreator"("creatorProfileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignCreator_campaignId_creatorProfileId_key" ON "CampaignCreator"("campaignId", "creatorProfileId");

-- CreateIndex
CREATE INDEX "Deliverable_campaignId_status_idx" ON "Deliverable"("campaignId", "status");

-- CreateIndex
CREATE INDEX "Deliverable_dueAt_idx" ON "Deliverable"("dueAt");

-- CreateIndex
CREATE INDEX "Shortlist_creatorProfileId_idx" ON "Shortlist"("creatorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Shortlist_brandAccountId_creatorProfileId_key" ON "Shortlist"("brandAccountId", "creatorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_campaignId_key" ON "CaseStudy"("campaignId");

-- CreateIndex
CREATE INDEX "CaseStudy_status_publishedAt_idx" ON "CaseStudy"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteContent_key_locale_key" ON "WebsiteContent"("key", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "PageSeo_path_locale_key" ON "PageSeo"("path", "locale");

-- CreateIndex
CREATE INDEX "UploadedAsset_creatorProfileId_idx" ON "UploadedAsset"("creatorProfileId");

-- CreateIndex
CREATE INDEX "UploadedAsset_creatorApplicationId_idx" ON "UploadedAsset"("creatorApplicationId");

-- CreateIndex
CREATE INDEX "UploadedAsset_caseStudyId_idx" ON "UploadedAsset"("caseStudyId");

-- CreateIndex
CREATE INDEX "UploadedAsset_campaignId_idx" ON "UploadedAsset"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedAsset_provider_publicId_key" ON "UploadedAsset"("provider", "publicId");

-- CreateIndex
CREATE INDEX "AdminNote_enquiryId_idx" ON "AdminNote"("enquiryId");

-- CreateIndex
CREATE INDEX "AdminNote_creatorApplicationId_idx" ON "AdminNote"("creatorApplicationId");

-- CreateIndex
CREATE INDEX "AdminNote_creatorProfileId_idx" ON "AdminNote"("creatorProfileId");

-- CreateIndex
CREATE INDEX "AdminNote_brandAccountId_idx" ON "AdminNote"("brandAccountId");

-- CreateIndex
CREATE INDEX "AdminNote_campaignId_idx" ON "AdminNote"("campaignId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityLog_actorId_idx" ON "ActivityLog"("actorId");

-- CreateIndex
CREATE INDEX "DeletionRequest_status_createdAt_idx" ON "DeletionRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "DeletionRequest_email_idx" ON "DeletionRequest"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorApplication" ADD CONSTRAINT "CreatorApplication_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CreatorCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorApplication" ADD CONSTRAINT "CreatorApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CreatorApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CreatorCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandAccount" ADD CONSTRAINT "BrandAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandAccount" ADD CONSTRAINT "BrandAccount_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandAccount" ADD CONSTRAINT "BrandAccount_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandEnquiry" ADD CONSTRAINT "BrandEnquiry_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandEnquiry" ADD CONSTRAINT "BrandEnquiry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandEnquiry" ADD CONSTRAINT "BrandEnquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandEnquiry" ADD CONSTRAINT "BrandEnquiry_brandAccountId_fkey" FOREIGN KEY ("brandAccountId") REFERENCES "BrandAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBrief" ADD CONSTRAINT "CampaignBrief_brandAccountId_fkey" FOREIGN KEY ("brandAccountId") REFERENCES "BrandAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_brandAccountId_fkey" FOREIGN KEY ("brandAccountId") REFERENCES "BrandAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "CampaignBrief"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "BrandEnquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCreator" ADD CONSTRAINT "CampaignCreator_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCreator" ADD CONSTRAINT "CampaignCreator_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_campaignCreatorId_fkey" FOREIGN KEY ("campaignCreatorId") REFERENCES "CampaignCreator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_brandAccountId_fkey" FOREIGN KEY ("brandAccountId") REFERENCES "BrandAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedAsset" ADD CONSTRAINT "UploadedAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedAsset" ADD CONSTRAINT "UploadedAsset_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedAsset" ADD CONSTRAINT "UploadedAsset_creatorApplicationId_fkey" FOREIGN KEY ("creatorApplicationId") REFERENCES "CreatorApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedAsset" ADD CONSTRAINT "UploadedAsset_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedAsset" ADD CONSTRAINT "UploadedAsset_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "BrandEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_creatorApplicationId_fkey" FOREIGN KEY ("creatorApplicationId") REFERENCES "CreatorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_brandAccountId_fkey" FOREIGN KEY ("brandAccountId") REFERENCES "BrandAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletionRequest" ADD CONSTRAINT "DeletionRequest_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
