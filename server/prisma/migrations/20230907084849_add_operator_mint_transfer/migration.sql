/*
  Warnings:

  - Added the required column `operator_address` to the `mint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operator_address` to the `transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mint" ADD COLUMN     "operator_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transfer" ADD COLUMN     "operator_address" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "mint_operator_address_idx" ON "mint"("operator_address");

-- CreateIndex
CREATE INDEX "transfer_operator_address_idx" ON "transfer"("operator_address");
