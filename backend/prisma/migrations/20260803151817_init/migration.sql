-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('PASSWORD', 'GOOGLE', 'GITHUB', 'APPLE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avater" TEXT NOT NULL,
    "last_login_at" TIMESTAMP(3) NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OauthAccount" (
    "userId" UUID NOT NULL,
    "provider" "AuthProvider",
    "passwordHash" TEXT,
    "providerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OauthAccount_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OauthAccount_provider_providerUserId_key" ON "OauthAccount"("provider", "providerUserId");

-- AddForeignKey
ALTER TABLE "OauthAccount" ADD CONSTRAINT "OauthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
