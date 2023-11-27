const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");

const Stats = require("../../../models/StatsModel");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");
const parseEther = require("../../../services/parseEther");

const UPSHOT_API_KEY = process.env.UPSHOT_API_KEY;

const profileStatsRoute = express();

profileStatsRoute.get("/", checkAuth, async (req, res) => {
  try {
    const address = req.query?.address || req.userDetails?.address;
    if (!address) throw new Error("No address provided");

    const sql = `
    SELECT 
    COALESCE(mint_count, 0) as mint_count, 
    COALESCE(sold_count, 0) as sold_count,
    COALESCE(bought_count, 0) as bought_count,
    COALESCE(sold_value, 0) / POWER(10, 18) as sold_value,
    COALESCE(num_txs, 0) as num_txs,
    COALESCE(num_assets_owned, 0) as num_assets_owned,
    COALESCE(num_collections_owned, 0) as num_collections_owned
FROM 
    (SELECT 
        (SELECT count(quantity) FROM ethereum.nft_transfers WHERE from_address IS NULL AND to_address = '${address}') as mint_count,
        (SELECT count(quantity) FROM ethereum.nft_sales WHERE seller_address = '${address}') as sold_count,
        (SELECT count(quantity) FROM ethereum.nft_sales WHERE buyer_address = '${address}') as bought_count,
        (SELECT sum(price) FROM ethereum.nft_sales WHERE seller_address = '${address}') as sold_value,
        (SELECT count(*) FROM ethereum.nft_transfers WHERE from_address = '${address}' OR to_address = '${address}') as num_txs,
        (SELECT COUNT(*) FROM ethereum.nft_owners WHERE owner_address = '${address}') as num_assets_owned,
        (SELECT COUNT(DISTINCT contract_address) FROM ethereum.nft_owners WHERE owner_address = '${address}') as num_collections_owned
    ) as subquery;
    `;
    const data2 = (await execTranseposeAPI(sql))?.[0];

    const { mint_count, sold_count, bought_count, sold_value, num_txs, num_assets_owned, num_collections_owned } = data2 || {};

    const returnData = {
      num_txs,
      num_assets_owned,
      num_collections_owned,
      total_gain: 0,
      volume: 0,
      nftsValue: 0,
      walletVolume: 0,
      mint_count,
      sold_count,
      bought_count,
      sold_value,
    };

    res.status(200).json({ ok: true, data: returnData });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "There was a problem fetching the data", ok: false, error: e });
  }
});

module.exports = profileStatsRoute;
