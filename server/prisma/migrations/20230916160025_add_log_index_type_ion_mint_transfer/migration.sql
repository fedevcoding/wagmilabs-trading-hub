/*
  Warnings:

  - Added the required column `log_index` to the `mint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `log_index` to the `transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `transfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "transfer_type" AS ENUM ('burn', 'transfer');

-- AlterTable
ALTER TABLE "mint" ADD COLUMN     "log_index" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "transfer" ADD COLUMN     "log_index" INTEGER NOT NULL,
ADD COLUMN     "type" "transfer_type" NOT NULL;

-- CreateIndex
CREATE INDEX "mint_log_index_idx" ON "mint"("log_index");

-- CreateIndex
CREATE INDEX "transfer_contract_address_type_idx" ON "transfer"("contract_address", "type");

-- CreateIndex
CREATE INDEX "transfer_timestamp_idx" ON "transfer"("timestamp");

-- CreateIndex
CREATE INDEX "transfer_log_index_idx" ON "transfer"("log_index");

-- CreateIndex
CREATE INDEX "transfer_type_idx" ON "transfer"("type");
