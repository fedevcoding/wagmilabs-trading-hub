/*
  Warnings:

  - You are about to alter the column `gas_price` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "max_fee_per_gas" INTEGER,
ADD COLUMN     "max_priority_fee_per_gas" INTEGER,
ALTER COLUMN "gas_price" DROP NOT NULL,
ALTER COLUMN "gas_price" SET DATA TYPE INTEGER,
ALTER COLUMN "transaction_fee" DROP NOT NULL,
ALTER COLUMN "to" DROP NOT NULL;
