const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../services/externalAPI/transpose");

const route = express();

function getPAndLData(bought, sold, allApprovalGasFees) {
  let nfts = {};
  for (const k in bought) {
    const nft = bought[k];
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

  nfts = Object.values(nfts);

  return nfts
    .filter((nft) => nft.sold)
    .map((nft) => {
      const approvalGasFees =
        allApprovalGasFees[nft.bought.contract_address?.toLowerCase()] ?? 0;
      const soldGasFees = nft.sold.royalty_fee + nft.sold.platform_fee;
      const soldCoef = nft.sold.usd_price / nft.sold.eth_price;
      const soldGasFeesUsd = soldGasFees * soldCoef;

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
            paid: {
              royaltyFee: nft.bought.royalty_fee,
              platformFee: nft.bought.platform_fee,
            },
            sold: {
              royaltyFee: nft.sold.royalty_fee,
              platformFee: nft.sold.platform_fee,
            },
            approval: approvalGasFees,
            total: {
              eth: soldGasFees,
              usd: soldGasFeesUsd,
            },
          },
          pOrL: {
            eth: nft.sold.eth_price - nft.bought.eth_price - soldGasFees,
            usd: nft.sold.usd_price - nft.bought.usd_price - soldGasFeesUsd,
          },
          holdDuration: diffInSeconds,
          gross: {
            eth: nft.sold.eth_price - soldGasFees,
            usd: nft.sold.usd_price - soldGasFeesUsd,
          },
        },
      };
    });
}

function formatApprovalGasFees(approvalGasFees) {
  const output = {};
  for (const value of approvalGasFees) {
    output[value.collection_address.toLowerCase()] =
      value.approval_gas_fees / 10 ** 18;
  }
  return output;
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

      const queryApprovalGasFees = `
        SELECT (gas_used * gas_price) as approval_gas_fees, to_address as collection_address FROM ethereum.transactions
            WHERE from_address = '${address}'
            AND input = '0xa22cb4650000000000000000000000001e0049783f008a0085193e00003d00cd54003c710000000000000000000000000000000000000000000000000000000000000001'`;

      const [bought, sold, approvalGasFees] = await Promise.all([
        execTranseposeAPI(query),
        execTranseposeAPI(querySell),
        execTranseposeAPI(queryApprovalGasFees),
      ]);

      res
        .status(200)
        .json(
          getPAndLData(bought, sold, formatApprovalGasFees(approvalGasFees))
        );
    } catch (e) {
      console.log("err", e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = route;
