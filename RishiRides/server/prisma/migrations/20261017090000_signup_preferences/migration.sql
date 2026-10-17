ALTER TABLE "User"
ADD COLUMN "preferredLanguage" VARCHAR(2) NOT NULL DEFAULT 'en',
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyAcceptedAt" TIMESTAMP(3);