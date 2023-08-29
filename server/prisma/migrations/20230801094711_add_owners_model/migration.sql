-- CreateTable
CREATE TABLE "owners" (
    "id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "owners_contract_address_idx" ON "owners"("contract_address");

-- CreateIndex
CREATE INDEX "owners_contract_address_address_idx" ON "owners"("contract_address", "address");

-- CreateIndex
CREATE INDEX "owners_address_idx" ON "owners"("address");

-- CreateIndex
CREATE INDEX "owners_quantity_idx" ON "owners"("quantity");

-- CreateIndex
CREATE INDEX "owners_token_id_idx" ON "owners"("token_id");
