/*
  Warnings:

  - Added the required column `log_count` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "data" TEXT,
ADD COLUMN     "log_count" INTEGER NOT NULL,
ADD COLUMN     "nonce" INTEGER NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "contract_address" DROP NOT NULL;
