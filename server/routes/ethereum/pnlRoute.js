const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../services/externalAPI/transpose");

const route = express();

route.get("/:address", checkAuth, (req, res) => {
  const { startDate, endDate } = req.query || {};

  async function getData() {
    try {
      const { address } = req.params || {};

      console.log("startDate");

      const start = new Date(parseInt(startDate)).toISOString();
      const end = new Date(parseInt(endDate)).toISOString();

      const query = `
        SELECT timestamp, contract_address, token_id, usd_price, eth_price, royalty_fee, platform_fee
        FROM ethereum.nft_sales
        WHERE buyer_address = '${address}' AND timestamp >= '${start}'  AND timestamp <= '${end}'
        AND exchange_name IN('opensea', 'blur', 'x2y2', 'sudoswap', 'looksrare')
        AND (contract_address, token_id) IN (
            SELECT contract_address, token_id
            FROM ethereum.nft_sales
            WHERE seller_address = '${address}' AND timestamp >= '${start}' AND timestamp <= '${end}'
            AND exchange_name IN('opensea', 'blur', 'x2y2', 'sudoswap', 'looksrare')
        )`;

      const data = await execTranseposeAPI(query);

      console.log("data", data);

      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = route;
