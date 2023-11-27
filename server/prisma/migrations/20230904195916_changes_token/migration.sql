/*
  Warnings:

  - You are about to drop the column `address` on the `owners` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contract_address,owner,token_id]` on the table `owners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner` to the `owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `erc_type` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "owners_address_idx";

-- DropIndex
DROP INDEX "owners_contract_address_address_idx";

-- DropIndex
DROP INDEX "owners_contract_address_address_token_id_key";

-- AlterTable
ALTER TABLE "owners" DROP COLUMN "address",
ADD COLUMN     "owner" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "token" ADD COLUMN     "erc_type" "erc_type" NOT NULL;

-- CreateIndex
CREATE INDEX "owners_contract_address_owner_idx" ON "owners"("contract_address", "owner");

-- CreateIndex
CREATE INDEX "owners_owner_idx" ON "owners"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "owners_contract_address_owner_token_id_key" ON "owners"("contract_address", "owner", "token_id");
