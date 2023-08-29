/*
  Warnings:

  - You are about to drop the `_token_attributes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_token_attributes" DROP CONSTRAINT "_token_attributes_A_fkey";

-- DropForeignKey
ALTER TABLE "_token_attributes" DROP CONSTRAINT "_token_attributes_B_fkey";

-- DropTable
DROP TABLE "_token_attributes";

-- CreateTable
CREATE TABLE "AttributesOnTokens" (
    "token_id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,

    CONSTRAINT "AttributesOnTokens_pkey" PRIMARY KEY ("token_id","attribute_id")
);

-- AddForeignKey
ALTER TABLE "AttributesOnTokens" ADD CONSTRAINT "AttributesOnTokens_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributesOnTokens" ADD CONSTRAINT "AttributesOnTokens_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
