-- CreateTable
CREATE TABLE "block" (
    "block_number" INTEGER NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "block_hash" TEXT NOT NULL,
    "parent_hash" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "miner" TEXT NOT NULL,
    "difficulty" BIGINT NOT NULL,
    "base_fee_per_gas" DOUBLE PRECISION,
    "gas_limit" INTEGER NOT NULL,
    "gas_used" INTEGER NOT NULL,

    CONSTRAINT "block_pkey" PRIMARY KEY ("block_number")
);

-- CreateTable
CREATE TABLE "transaction" (
    "transaction_hash" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "gas_limit" INTEGER NOT NULL,
    "gas_used" INTEGER NOT NULL,
    "gas_price" DOUBLE PRECISION NOT NULL,
    "transaction_fee" DOUBLE PRECISION NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "transaction_index" INTEGER NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transaction_hash")
);

-- CreateTable
CREATE TABLE "log" (
    "id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "log_index" INTEGER NOT NULL,
    "block_number" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "data" TEXT NOT NULL,
    "topic_0" TEXT,
    "topic_1" TEXT,
    "topic_2" TEXT,
    "topic_3" TEXT,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "block_block_hash_key" ON "block"("block_hash");

-- CreateIndex
CREATE INDEX "block_block_number_idx" ON "block"("block_number");

-- CreateIndex
CREATE INDEX "block_timestamp_idx" ON "block"("timestamp");

-- CreateIndex
CREATE INDEX "transaction_block_number_idx" ON "transaction"("block_number");

-- CreateIndex
CREATE INDEX "transaction_timestamp_idx" ON "transaction"("timestamp");

-- CreateIndex
CREATE INDEX "transaction_transaction_hash_idx" ON "transaction"("transaction_hash");

-- CreateIndex
CREATE INDEX "transaction_from_idx" ON "transaction"("from");

-- CreateIndex
CREATE INDEX "transaction_to_idx" ON "transaction"("to");

-- CreateIndex
CREATE INDEX "transaction_contract_address_idx" ON "transaction"("contract_address");

-- CreateIndex
CREATE INDEX "log_transaction_hash_idx" ON "log"("transaction_hash");

-- CreateIndex
CREATE INDEX "log_block_number_idx" ON "log"("block_number");

-- CreateIndex
CREATE INDEX "log_topic_0_topic_1_topic_2_topic_3_idx" ON "log"("topic_0", "topic_1", "topic_2", "topic_3");

-- CreateIndex
CREATE UNIQUE INDEX "log_transaction_hash_log_index_key" ON "log"("transaction_hash", "log_index");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_block_number_fkey" FOREIGN KEY ("block_number") REFERENCES "block"("block_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_transaction_hash_fkey" FOREIGN KEY ("transaction_hash") REFERENCES "transaction"("transaction_hash") ON DELETE RESTRICT ON UPDATE CASCADE;
