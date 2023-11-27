/*
  Warnings:

  - You are about to drop the column `quantity` on the `token` table. All the data in the column will be lost.
  - Added the required column `remaining_supply` to the `token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_burns` to the `token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_supply` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" DROP COLUMN "quantity",
ADD COLUMN     "remaining_supply" TEXT NOT NULL,
ADD COLUMN     "total_burns" TEXT NOT NULL,
ADD COLUMN     "total_supply" TEXT NOT NULL;
