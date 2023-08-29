-- CreateIndex
CREATE INDEX "AttributesOnTokens_token_id_idx" ON "AttributesOnTokens"("token_id");

-- CreateIndex
CREATE INDEX "AttributesOnTokens_attribute_id_idx" ON "AttributesOnTokens"("attribute_id");

-- CreateIndex
CREATE INDEX "attribute_contract_address_idx" ON "attribute"("contract_address");

-- CreateIndex
CREATE INDEX "attribute_contract_address_key_idx" ON "attribute"("contract_address", "key");

-- CreateIndex
CREATE INDEX "attribute_id_idx" ON "attribute"("id");

-- CreateIndex
CREATE INDEX "token_token_id_idx" ON "token"("token_id");
