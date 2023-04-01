const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../services/externalAPI/transpose");

const statsRoute = express();

const Stats = require("../../models/StatsModel");

statsRoute.post("/", async (req, res) => {
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

      let collections = {};

      (bought ? Object.keys(bought) : []).forEach(k => {
        const address = bought[k].contract_address.toLowerCase();
        if (!collections[address]) {
          collections[address] = { ...emptyObj, address };
        }
      });
      (sold ? Object.keys(sold) : []).forEach(k => {
        const address = sold[k].contract_address.toLowerCase();
        if (!collections[address]) {
          collections[address] = { ...emptyObj, address };
        }
      });
      (minted ? Object.keys(minted) : []).forEach(k => {
        const address = minted[k].contract_address.toLowerCase();
        if (!collections[address]) {
          collections[address] = { ...emptyObj, address };
        }
      });

      collections = Object.values(collections);

      (bought ? Object.keys(bought) : []).forEach(k => {
        const address = bought[k].contract_address.toLowerCase();

        collections = collections.map(c => {
          if (c.address === address) {
            return {
              address,
              bought: {
                count: c.bought.count + 1,
                usd_price: c.bought.usd_price + bought[k].usd_price,
                eth_price: c.bought.eth_price + bought[k].eth_price,
                fee: c.bought.fee + bought[k].royalty_fee + bought[k].platform_fee,
              },
              sold: c.sold,
              minted: c.minted,
            };
          }
          return c;
        });
      });

      (sold ? Object.keys(sold) : []).forEach(k => {
        const address = sold[k].contract_address.toLowerCase();

        collections = collections.map(c => {
          if (c.address === address) {
            return {
              address,
              sold: {
                count: c.sold.count + 1,
                usd_price: c.sold.usd_price + sold[k].usd_price,
                eth_price: c.sold.eth_price + sold[k].eth_price,
                fee: c.sold.fee + sold[k].royalty_fee + sold[k].platform_fee,
              },
              bought: c.bought,
              minted: c.minted,
            };
          }
          return c;
        });
      });

      (minted ? Object.keys(minted) : []).forEach(k => {
        const address = minted[k].contract_address.toLowerCase();

        collections = collections.map(c => {
          if (c.address === address) {
            return {
              address,
              minted: {
                count: c.minted.count + 1,
                eth_price: c.minted.eth_price + minted[k].mint_tx_price,
                fee: c.minted.fee + minted[k].mint_tx_fee,
              },
              bought: c.bought,
              sold: c.sold,
            };
          }
          return c;
        });
      });

      res.status(200).json({
        collections,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = statsRoute;
