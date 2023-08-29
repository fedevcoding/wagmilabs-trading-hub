/*
  Warnings:

  - A unique constraint covering the columns `[contract_address,address,token_id]` on the table `owners` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "collection" ADD COLUMN     "unique_owners" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "owners_contract_address_address_token_id_key" ON "owners"("contract_address", "address", "token_id");
