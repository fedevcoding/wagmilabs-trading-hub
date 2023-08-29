-- CreateEnum
CREATE TYPE "erc_type" AS ENUM ('ERC721', 'ERC1155');

-- CreateEnum
CREATE TYPE "listing_status" AS ENUM ('active', 'inactive', 'expired', 'canceled', 'filled');

-- CreateEnum
CREATE TYPE "sale_type" AS ENUM ('ask', 'bid');

-- CreateEnum
CREATE TYPE "stats_type" AS ENUM ('usage_time', 'view', 'login', 'pnl_download', 'partnership_comeback', 'bought_pro');

-- CreateTable
CREATE TABLE "attribute" (
    "id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection" (
    "id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "image" TEXT DEFAULT 'https://storage.googleapis.com/opensea-static/opensea-profile/10.png',
    "name" TEXT,
    "banner" TEXT,
    "total_supply" INTEGER NOT NULL,
    "description" TEXT,
    "floor_price" DOUBLE PRECISION,
    "floor_price_currency" TEXT,
    "slug" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "opensea_verificated" BOOLEAN NOT NULL,
    "top_bid" DOUBLE PRECISION,
    "top_bid_currency" TEXT,
    "opensea_royalties" DOUBLE PRECISION,
    "twitter" TEXT,
    "discord" TEXT,
    "website" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erc_type" "erc_type" NOT NULL,
    "creator" TEXT,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_floor_change" (
    "id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "floor_price" DOUBLE PRECISION,
    "previous_floor_price" DOUBLE PRECISION,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "collection_floor_change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing" (
    "id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "valid_from" TIMESTAMPTZ(6) NOT NULL,
    "valid_until" TIMESTAMPTZ(6),
    "expiration" TIMESTAMPTZ(6),
    "marketplace" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "order_hash" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "taker" TEXT,
    "status" "listing_status" NOT NULL,
    "erc_type" "erc_type" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantity_remaining" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency" TEXT NOT NULL,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mint" (
    "id" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "is_batch" BOOLEAN NOT NULL DEFAULT false,
    "batch_size" INTEGER,
    "batch_index" INTEGER,
    "total_value" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "quantity" TEXT NOT NULL DEFAULT '1',
    "minter_address" TEXT NOT NULL,
    "erc_type" "erc_type" NOT NULL,

    CONSTRAINT "mint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pass_type" INTEGER NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://storage.googleapis.com/opensea-static/opensea-profile/10.png',

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_setting" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "profile_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale" (
    "id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "marketplace" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "order_hash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "sale_type" "sale_type" NOT NULL,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stat" (
    "id" TEXT NOT NULL,
    "type" "stats_type" NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "address" TEXT,
    "ip_address" TEXT,
    "pass_type" INTEGER,
    "extra_data" TEXT,

    CONSTRAINT "stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "media" TEXT,
    "quantity" TEXT NOT NULL,
    "erc_type" "erc_type" NOT NULL,
    "rarity_rank" INTEGER,
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "owner" TEXT NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tradingview_chart" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tradingview_chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer" (
    "id" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "erc_type" "erc_type" NOT NULL,

    CONSTRAINT "transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_token_attributes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "attribute_contract_address_key_value_key" ON "attribute"("contract_address", "key", "value");

-- CreateIndex
CREATE UNIQUE INDEX "collection_contract_address_key" ON "collection"("contract_address");

-- CreateIndex
CREATE INDEX "collection_contract_address_idx" ON "collection"("contract_address");

-- CreateIndex
CREATE INDEX "collection_name_idx" ON "collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "collection_floor_change_event_id_key" ON "collection_floor_change"("event_id");

-- CreateIndex
CREATE INDEX "collection_floor_change_contract_address_idx" ON "collection_floor_change"("contract_address");

-- CreateIndex
CREATE INDEX "collection_floor_change_contract_address_timestamp_idx" ON "collection_floor_change"("contract_address", "timestamp");

-- CreateIndex
CREATE INDEX "collection_floor_change_timestamp_idx" ON "collection_floor_change"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "email_email_key" ON "email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "email_address_key" ON "email"("address");

-- CreateIndex
CREATE UNIQUE INDEX "listing_order_hash_key" ON "listing"("order_hash");

-- CreateIndex
CREATE INDEX "listing_contract_address_status_idx" ON "listing"("contract_address", "status");

-- CreateIndex
CREATE INDEX "listing_contract_address_token_id_idx" ON "listing"("contract_address", "token_id");

-- CreateIndex
CREATE INDEX "listing_contract_address_valid_from_idx" ON "listing"("contract_address", "valid_from");

-- CreateIndex
CREATE INDEX "listing_contract_address_value_idx" ON "listing"("contract_address", "value");

-- CreateIndex
CREATE INDEX "listing_valid_from_idx" ON "listing"("valid_from");

-- CreateIndex
CREATE INDEX "mint_contract_address_timestamp_idx" ON "mint"("contract_address", "timestamp");

-- CreateIndex
CREATE INDEX "mint_contract_address_token_id_idx" ON "mint"("contract_address", "token_id");

-- CreateIndex
CREATE INDEX "mint_contract_address_value_idx" ON "mint"("contract_address", "value");

-- CreateIndex
CREATE INDEX "mint_transaction_hash_idx" ON "mint"("transaction_hash");

-- CreateIndex
CREATE INDEX "mint_timestamp_idx" ON "mint"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "mint_contract_address_token_id_transaction_hash_key" ON "mint"("contract_address", "token_id", "transaction_hash");

-- CreateIndex
CREATE UNIQUE INDEX "profile_address_key" ON "profile"("address");

-- CreateIndex
CREATE UNIQUE INDEX "profile_setting_profile_id_key" ON "profile_setting"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "sale_sale_id_key" ON "sale"("sale_id");

-- CreateIndex
CREATE INDEX "sale_contract_address_timestamp_idx" ON "sale"("contract_address", "timestamp");

-- CreateIndex
CREATE INDEX "sale_contract_address_token_id_idx" ON "sale"("contract_address", "token_id");

-- CreateIndex
CREATE INDEX "sale_contract_address_value_idx" ON "sale"("contract_address", "value");

-- CreateIndex
CREATE INDEX "sale_timestamp_idx" ON "sale"("timestamp");

-- CreateIndex
CREATE INDEX "sale_transaction_hash_idx" ON "sale"("transaction_hash");

-- CreateIndex
CREATE INDEX "token_contract_address_idx" ON "token"("contract_address");

-- CreateIndex
CREATE INDEX "token_contract_address_token_id_idx" ON "token"("contract_address", "token_id");

-- CreateIndex
CREATE INDEX "token_name_idx" ON "token"("name");

-- CreateIndex
CREATE INDEX "token_owner_idx" ON "token"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "token_contract_address_token_id_key" ON "token"("contract_address", "token_id");

-- CreateIndex
CREATE INDEX "transfer_contract_address_timestamp_idx" ON "transfer"("contract_address", "timestamp");

-- CreateIndex
CREATE INDEX "transfer_contract_address_token_id_idx" ON "transfer"("contract_address", "token_id");

-- CreateIndex
CREATE INDEX "transfer_transaction_hash_idx" ON "transfer"("transaction_hash");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_contract_address_token_id_transaction_hash_key" ON "transfer"("contract_address", "token_id", "transaction_hash");

-- CreateIndex
CREATE UNIQUE INDEX "_token_attributes_AB_unique" ON "_token_attributes"("A", "B");

-- CreateIndex
CREATE INDEX "_token_attributes_B_index" ON "_token_attributes"("B");

-- AddForeignKey
ALTER TABLE "collection_floor_change" ADD CONSTRAINT "collection_floor_change_contract_address_fkey" FOREIGN KEY ("contract_address") REFERENCES "collection"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_contract_address_fkey" FOREIGN KEY ("contract_address") REFERENCES "collection"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mint" ADD CONSTRAINT "mint_contract_address_fkey" FOREIGN KEY ("contract_address") REFERENCES "collection"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_setting" ADD CONSTRAINT "profile_setting_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_contract_address_fkey" FOREIGN KEY ("contract_address") REFERENCES "collection"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_contract_address_fkey" FOREIGN KEY ("contract_address") REFERENCES "collection"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_contract_address_fkey" FOREIGN KEY ("contract_address") REFERENCES "collection"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_token_attributes" ADD CONSTRAINT "_token_attributes_A_fkey" FOREIGN KEY ("A") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_token_attributes" ADD CONSTRAINT "_token_attributes_B_fkey" FOREIGN KEY ("B") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
