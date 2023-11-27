/*
  Warnings:

  - You are about to drop the column `plan` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the `email` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `plan_type` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "profile_plan_idx";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "plan",
ADD COLUMN     "plan_type" "plan_type" NOT NULL;

-- DropTable
DROP TABLE "email";

-- CreateIndex
CREATE INDEX "profile_plan_type_idx" ON "profile"("plan_type");
