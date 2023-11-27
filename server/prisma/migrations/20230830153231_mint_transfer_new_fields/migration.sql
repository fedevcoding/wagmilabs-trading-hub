/*
  Warnings:

  - You are about to drop the `log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `erc_type` to the `mint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `erc_type` to the `transfer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "log" DROP CONSTRAINT "log_transaction_hash_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_block_number_fkey";

-- AlterTable
ALTER TABLE "mint" ADD COLUMN     "erc_type" "erc_type" NOT NULL,
ADD COLUMN     "transaction_fee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "transfer" ADD COLUMN     "erc_type" "erc_type" NOT NULL,
ADD COLUMN     "transaction_fee" DOUBLE PRECISION;

-- DropTable
DROP TABLE "log";

-- DropTable
DROP TABLE "transaction";
