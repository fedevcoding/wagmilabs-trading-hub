const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../services/externalAPI/transpose");

const route = express();

function formatPAndLData(nfts) {
  return nfts
    .filter((nft) => nft.sold)
    .map((nft) => {
      const totalGasFees = nft.sold.royalty_fee + nft.sold.platform_fee;
      const soldCoef = nft.sold.usd_price / nft.sold.eth_price;

      const totalGasFeesUsd =
        (nft.sold.royalty_fee + nft.sold.platform_fee) * soldCoef;

      const diffInSeconds =
        (new Date(nft.sold.timestamp).getTime() -
          new Date(nft.bought.timestamp).getTime()) /
        1000;

      return {
        ...nft,
        info: {
          nft: {
            address: nft.bought.contract_address,
            id: nft.bought.token_id,
          },
          paid: {
            usd: nft.bought.usd_price,
            eth: nft.bought.eth_price,
          },
          sold: {
            usd: nft.sold.usd_price,
            eth: nft.sold.eth_price,
          },
          gasFees: {
            paid: nft.bought.royalty_fee + nft.bought.platform_fee,
            sold: nft.sold.royalty_fee + nft.sold.platform_fee,
            total: {
              eth: totalGasFees,
              usd: totalGasFeesUsd,
            },
          },
          pOrL: {
            eth: nft.sold.eth_price - nft.bought.eth_price - totalGasFees,
            usd: nft.sold.usd_price - nft.bought.usd_price - totalGasFeesUsd,
          },
          holdDuration: diffInSeconds,
          gross: {
            eth: nft.sold.eth_price - totalGasFees,
            usd: nft.sold.usd_price - totalGasFeesUsd,
          },
        },
      };
    });
}

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
        SELECT timestamp, contract_address, token_id, usd_price, eth_price, royalty_fee, platform_fee
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
      SELECT timestamp, contract_address, token_id, usd_price, eth_price, royalty_fee, platform_fee
      FROM ethereum.nft_sales
      WHERE seller_address = '${address}' AND timestamp >= '${start}'  AND timestamp <= '${end}'
      AND ${exchangeCondition}
      AND CONCAT(contract_address, token_id) IN (
          SELECT CONCAT(contract_address, token_id)
          FROM ethereum.nft_sales
          WHERE buyer_address = '${address}' AND timestamp >= '${start}' AND timestamp <= '${end}'
          AND ${exchangeCondition}
      )`;

      const [data, sold] = await Promise.all([
        execTranseposeAPI(query),
        execTranseposeAPI(querySell),
      ]);

      const nfts = {};
      for (const k in data) {
        const nft = data[k];
        const key = (nft.contract_address + ":" + nft.token_id).toLowerCase();
        if (!nfts[key])
          nfts[key] = {
            bought: nft,
          };
      }

      for (const k in sold) {
        const nft = sold[k];
        const key = (nft.contract_address + ":" + nft.token_id).toLowerCase();
        if (nfts[key] && !nfts[key].sold) nfts[key].sold = nft;
      }

      res.status(200).json(formatPAndLData(Object.values(nfts)));
    } catch (e) {
      console.log("err", e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = route;
