/*
  Warnings:

  - Added the required column `transaction_count` to the `block` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "block" ADD COLUMN     "transaction_count" INTEGER NOT NULL;
