/*
  Warnings:

  - A unique constraint covering the columns `[address,resolution,symbol,contract_address]` on the table `tradingview_chart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "mails" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mails_address_key" ON "mails"("address");

-- CreateIndex
CREATE UNIQUE INDEX "mails_email_key" ON "mails"("email");

-- CreateIndex
CREATE INDEX "mails_address_idx" ON "mails"("address");

-- CreateIndex
CREATE INDEX "mails_email_idx" ON "mails"("email");

-- CreateIndex
CREATE INDEX "tradingview_chart_address_idx" ON "tradingview_chart"("address");

-- CreateIndex
CREATE INDEX "tradingview_chart_contract_address_idx" ON "tradingview_chart"("contract_address");

-- CreateIndex
CREATE UNIQUE INDEX "tradingview_chart_address_resolution_symbol_contract_addres_key" ON "tradingview_chart"("address", "resolution", "symbol", "contract_address");
