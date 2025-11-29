/*
  Warnings:

  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "user_state" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "CustomerState" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_active",
ADD COLUMN     "user_state" "user_state" DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(5) NOT NULL,
    "businessName" VARCHAR(50),
    "legalName" VARCHAR(100) NOT NULL,
    "taxId" VARCHAR(20) NOT NULL,
    "address" VARCHAR(255),
    "phone" VARCHAR(20),
    "customer_state" "CustomerState" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_code_key" ON "customers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_businessName_key" ON "customers"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "customers_taxId_key" ON "customers"("taxId");
