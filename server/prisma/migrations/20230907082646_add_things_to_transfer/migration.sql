/*
  Warnings:

  - Added the required column `is_batch` to the `transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mint" ALTER COLUMN "is_batch" DROP DEFAULT,
ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "transfer" ADD COLUMN     "batch_index" INTEGER,
ADD COLUMN     "batch_size" INTEGER,
ADD COLUMN     "is_batch" BOOLEAN NOT NULL;
