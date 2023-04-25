const express = require("express");
const { parseEther } = require("../../../../client/wagmilabsTradingTool/src/utils/formats/formats");
const checkAuth = require("../../../middleware/checkAuth");

const Stats = require("../../../models/StatsModel");
const { isTeam } = require("../../../config/allowedAddresses");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");

const UPSHOT_API_KEY = process.env.UPSHOT_API_KEY;

const profileStatsRoute = express();

profileStatsRoute.get("/", checkAuth, async (req, res) => {
  try {
    const address = req.query?.address || req.userDetails?.address;
    if (!address) throw new Error("No address provided");

    const isPartTeam = isTeam(address);
    if (!isPartTeam) {
      await Stats.create({ type: "profileStats", timestamp: Date.now(), address });
    }

    let data = await fetch(`https://api.upshot.xyz/v2/wallets/${address}/stats`, {
      headers: {
        "x-api-key": UPSHOT_API_KEY,
      },
    });

    data = (await data.json())?.data;
    const { num_txs, num_assets_owned, num_collections_owned, total_gain, volume, portfolio_value_wei } = data || {};

    const nftsValue = parseEther(portfolio_value_wei !== "[object Object]" ? portfolio_value_wei : "0", false);
    const walletVolume = parseEther(data?.volume, false);

    const sql = `
    SELECT 
    COALESCE(mint_count, 0) as mint_count, 
    COALESCE(sold_count, 0) as sold_count,
    COALESCE(bought_count, 0) as bought_count,
    COALESCE(sold_value, 0) / POWER(10, 18) as sold_value
FROM 
    (SELECT 
        (SELECT count(quantity) FROM ethereum.nft_transfers WHERE from_address IS NULL AND to_address = '${address}') as mint_count,
        (SELECT count(quantity) FROM ethereum.nft_sales WHERE seller_address = '${address}') as sold_count,
        (SELECT count(quantity) FROM ethereum.nft_sales WHERE buyer_address = '${address}') as bought_count,
        (SELECT sum(price) FROM ethereum.nft_sales WHERE seller_address = '${address}') as sold_value
    ) as subquery;
    `;
    const data2 = (await execTranseposeAPI(sql))?.[0];

    const { mint_count, sold_count, bought_count, sold_value } = data2 || {};

    const returnData = {
      num_txs,
      num_assets_owned,
      num_collections_owned,
      total_gain,
      volume,
      nftsValue,
      walletVolume,
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
