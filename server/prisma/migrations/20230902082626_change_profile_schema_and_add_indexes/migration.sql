/*
  Warnings:

  - You are about to drop the column `pass_type` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `pass_type` on the `stat` table. All the data in the column will be lost.
  - You are about to drop the `profile_setting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `plan` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "plan_type" AS ENUM ('free', 'pro', 'founder_pass', 'partnership');

-- DropForeignKey
ALTER TABLE "profile_setting" DROP CONSTRAINT "profile_setting_profile_id_fkey";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "pass_type",
ADD COLUMN     "plan" "plan_type" NOT NULL;

-- AlterTable
ALTER TABLE "stat" DROP COLUMN "pass_type",
ADD COLUMN     "plan_type" "plan_type";

-- DropTable
DROP TABLE "profile_setting";

-- CreateIndex
CREATE INDEX "profile_address_idx" ON "profile"("address");

-- CreateIndex
CREATE INDEX "profile_plan_idx" ON "profile"("plan");

-- CreateIndex
CREATE INDEX "stat_type_idx" ON "stat"("type");

-- CreateIndex
CREATE INDEX "stat_timestamp_idx" ON "stat"("timestamp");

-- CreateIndex
CREATE INDEX "stat_plan_type_idx" ON "stat"("plan_type");
