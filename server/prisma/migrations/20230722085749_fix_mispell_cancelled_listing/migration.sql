/*
  Warnings:

  - The values [canceled] on the enum `listing_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "listing_status_new" AS ENUM ('active', 'inactive', 'expired', 'cancelled', 'filled');
ALTER TABLE "listing" ALTER COLUMN "status" TYPE "listing_status_new" USING ("status"::text::"listing_status_new");
ALTER TYPE "listing_status" RENAME TO "listing_status_old";
ALTER TYPE "listing_status_new" RENAME TO "listing_status";
DROP TYPE "listing_status_old";
COMMIT;
