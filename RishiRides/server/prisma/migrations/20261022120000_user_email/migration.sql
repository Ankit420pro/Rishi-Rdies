ALTER TABLE "User" ADD COLUMN "email" VARCHAR(254);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");