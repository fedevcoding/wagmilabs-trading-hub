/*
  Warnings:

  - A unique constraint covering the columns `[contract_address,token_id,transaction_hash,from,to]` on the table `transfer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "transfer_contract_address_token_id_transaction_hash_key";

-- CreateIndex
CREATE UNIQUE INDEX "transfer_contract_address_token_id_transaction_hash_from_to_key" ON "transfer"("contract_address", "token_id", "transaction_hash", "from", "to");
