const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../services/externalAPI/transpose");
const {
  getTxsGasFees,
  formatApprovalGasFees,
  getNftObj,
  getNftMintedObj,
  getPAndLData,
} = require("../../services/pAndL");

const route = express();

route.get("/:address", checkAuth, (req, res) => {
  const { startDate, endDate } = req.query || {};

  async function getData() {
    try {
      const { address } = req.params || {};

      const start = new Date(parseInt(startDate)).toISOString();
      const end = new Date(parseInt(endDate)).toISOString();

      const exchangeCondition =
        "exchange_name IN('opensea', 'blur', 'x2y2', 'sudoswap', 'looksrare')";

      const query = `
        SELECT timestamp, contract_address, token_id, usd_price, eth_price, royalty_fee, platform_fee, transaction_hash
        FROM ethereum.nft_sales
        WHERE buyer_address = '${address}' AND timestamp >= '${start}'  AND timestamp <= '${end}'
        AND ${exchangeCondition}
        AND CONCAT(contract_address, token_id) IN (
            SELECT CONCAT(contract_address, token_id)
            FROM ethereum.nft_sales
            WHERE seller_address = '${address}' AND timestamp >= '${start}' AND timestamp <= '${end}'
            AND ${exchangeCondition}
        )`;

      const querySell = `
        SELECT timestamp, contract_address, token_id, usd_price, eth_price, royalty_fee, platform_fee, transaction_hash
        FROM ethereum.nft_sales
        WHERE seller_address = '${address}' AND timestamp >= '${start}'  AND timestamp <= '${end}'
        AND ${exchangeCondition}
        AND CONCAT(contract_address, token_id) IN (
          SELECT CONCAT(contract_address, token_id)
          FROM ethereum.nft_sales
          WHERE buyer_address = '${address}' AND timestamp >= '${start}' AND timestamp <= '${end}'
          AND ${exchangeCondition}
        )`;

      const queryApprovalGasFees = `
        SELECT (gas_used * gas_price) as approval_gas_fees, to_address as collection_address FROM ethereum.transactions
          WHERE from_address = '${address}'
          AND input = '0xa22cb4650000000000000000000000001e0049783f008a0085193e00003d00cd54003c710000000000000000000000000000000000000000000000000000000000000001'`;

      const mintedNftsQuery = `
        SELECT transfer.contract_address, transfer.token_id, transfer.transaction_hash, transfer.quantity as quantity_minted, t.transaction_fee as mint_tx_fee, transfer.timestamp as minted_timestamp,
          s.timestamp, s.usd_price, s.eth_price, s.royalty_fee, s.platform_fee
          FROM ethereum.nft_transfers transfer
          INNER JOIN ethereum.transactions t ON t.transaction_hash = transfer.transaction_hash
          INNER JOIN ethereum.nft_sales s ON s.contract_address = transfer.contract_address AND s.token_id = transfer.token_id AND s.seller_address = '${address}' AND s.timestamp >= '${start}' AND s.timestamp <= '${end}'
          WHERE transfer.to_address = '${address}' and transfer.category = 'mint' AND transfer.timestamp >= '${start}' AND transfer.timestamp <= '${end}'
          `;

      const [bought, sold] = await Promise.all([
        execTranseposeAPI(query),
        execTranseposeAPI(querySell),
      ]);

      const [approvalGasFees, minted] = await Promise.all([
        execTranseposeAPI(queryApprovalGasFees),
        execTranseposeAPI(mintedNftsQuery),
      ]);

      const nfts = getNftObj(bought, sold);
      const nftsMinted = getNftMintedObj(minted);
      const txsGasFees = await getTxsGasFees(nfts);

      res
        .status(200)
        .json(
          getPAndLData(
            nfts.concat(nftsMinted),
            formatApprovalGasFees(approvalGasFees),
            txsGasFees
          )
        );
    } catch (e) {
      console.log("err", e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = route;
