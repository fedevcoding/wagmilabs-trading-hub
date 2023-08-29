/*
  Warnings:

  - You are about to drop the column `erc_type` on the `mint` table. All the data in the column will be lost.
  - You are about to drop the column `erc_type` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `erc_type` on the `transfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mint" DROP COLUMN "erc_type";

-- AlterTable
ALTER TABLE "token" DROP COLUMN "erc_type";

-- AlterTable
ALTER TABLE "transfer" DROP COLUMN "erc_type";
