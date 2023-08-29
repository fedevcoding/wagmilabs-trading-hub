/*
  Warnings:

  - A unique constraint covering the columns `[contract_address,token_id,transaction_hash,minter_address]` on the table `mint` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "mint_contract_address_token_id_transaction_hash_key";

-- AlterTable
ALTER TABLE "listing" ALTER COLUMN "valid_from" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "mint_contract_address_token_id_transaction_hash_minter_addr_key" ON "mint"("contract_address", "token_id", "transaction_hash", "minter_address");
