-- DropIndex
DROP INDEX "listing_valid_from_idx";

-- CreateIndex
CREATE INDEX "listing_maker_valid_from_idx" ON "listing"("maker", "valid_from");

-- CreateIndex
CREATE INDEX "listing_marketplace_idx" ON "listing"("marketplace");

-- CreateIndex
CREATE INDEX "listing_maker_idx" ON "listing"("maker");
