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

const statsRoute = express();

const Stats = require("../../models/StatsModel");

statsRoute.post("/", checkAuth, async (req, res) => {
  const { type, timestamp, address } = req.body || {};

  try {
    const stats = await Stats.create({ type, timestamp, address });
    if (!stats) throw Error("Something went wrong saving the stats");
    res.status(200).json({});
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
});

statsRoute.get("/:address", checkAuth, (req, res) => {
  async function getData() {
    try {
      const { address } = req.params || {}; // "0x62fBD7F8D0668161710A0b463FD004cba42DA050";

      const exchangeCondition = "exchange_name IN('opensea', 'blur', 'x2y2', 'sudoswap', 'looksrare')";

      const query = `
          SELECT contract_address, usd_price, eth_price, royalty_fee, platform_fee
          FROM ethereum.nft_sales
          WHERE buyer_address = '${address}' 
          AND ${exchangeCondition}`;

      const querySell = `
          SELECT contract_address, usd_price, eth_price, royalty_fee, platform_fee
          FROM ethereum.nft_sales
          WHERE seller_address = '${address}' 
          AND ${exchangeCondition}`;

      const mintedNftsQuery = `
          SELECT tx.mint_tx_fee, tx.mint_tx_price, tx.contract_address, transfer.quantity as quantity_minted
            FROM (
                SELECT (max(t.transaction_fee) / count(token_id)) as mint_tx_fee, (max(t.value) / count(token_id)) as mint_tx_price, transfer.contract_address, transfer.transaction_hash as minted_transaction_hash
                FROM ethereum.nft_transfers transfer
                INNER JOIN ethereum.transactions t ON t.transaction_hash = transfer.transaction_hash
                WHERE transfer.to_address = '${address}' and transfer.category = 'mint' 
                group by transfer.transaction_hash, transfer.contract_address
            ) tx
            INNER JOIN ethereum.nft_transfers transfer ON transfer.contract_address = tx.contract_address AND  transfer.transaction_hash = tx.minted_transaction_hash AND transfer.to_address = '${address}' and transfer.category = 'mint'`;

      const [bought, sold, mintedData] = await Promise.all([
        execTranseposeAPI(query),
        execTranseposeAPI(querySell),
        execTranseposeAPI(mintedNftsQuery),
      ]);

      const minted = (mintedData || []).map(m => ({
        ...m,
        mint_tx_fee: m.mint_tx_fee ? m.mint_tx_fee / 10 ** 18 : m.mint_tx_fee,
        mint_tx_price: m.mint_tx_price ? m.mint_tx_price / 10 ** 18 : m.mint_tx_price,
      }));

      const collections = {};

      const emptyObj = {
        bought: {
          count: 0,
          usd_price: 0,
          eth_price: 0,
          fee: 0,
        },
        sold: {
          count: 0,
          usd_price: 0,
          eth_price: 0,
          fee: 0,
        },
        minted: {
          count: 0,
          eth_price: 0,
          fee: 0,
        },
      };

      let keys = bought ? Object.keys(bought) : [];

      keys.forEach(k => {
        const address = bought[k].contract_address.toLowerCase();

        if (!collections[address]) {
          collections[address] = { ...emptyObj, address };
        }

        collections[address].bought = keys.reduce((acc, key) => {
          if (bought[key].contract_address.toLowerCase() === address) {
            return {
              count: acc.count + 1,
              usd_price: acc.usd_price + bought[key].usd_price,
              eth_price: acc.eth_price + bought[key].eth_price,
              fee: acc.fee + bought[key].royalty_fee + bought[key].platform_fee,
            };
          }

          return acc;
        }, collections[address].bought);
      });

      keys = sold ? Object.keys(sold) : [];
      keys.forEach(k => {
        const address = sold[k].contract_address.toLowerCase();

        if (!collections[address]) {
          collections[address] = { ...emptyObj, address };
        }

        collections[address].sold = keys.reduce((acc, key) => {
          if (sold[key].contract_address.toLowerCase() === address) {
            return {
              count: acc.count + 1,
              usd_price: acc.usd_price + sold[key].usd_price,
              eth_price: acc.eth_price + sold[key].eth_price,
              fee: acc.fee + sold[key].royalty_fee + sold[key].platform_fee,
            };
          }

          return acc;
        }, collections[address].sold);
      });

      keys = minted ? Object.keys(minted) : [];
      keys.forEach(k => {
        const address = minted[k].contract_address.toLowerCase();

        if (!collections[address]) {
          collections[address] = { ...emptyObj, address };
        }

        collections[address].minted = keys.reduce((acc, key) => {
          if (minted[key].contract_address.toLowerCase() === address) {
            return {
              count: acc.count + minted[key].quantity_minted,
              eth_price: acc.eth_price + minted[key].mint_tx_price,
              fee: acc.fee + minted[key].mint_tx_fee,
            };
          }

          return acc;
        }, collections[address].minted);
      });

      res.status(200).json({
        collections: Object.values(collections),
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = statsRoute;
