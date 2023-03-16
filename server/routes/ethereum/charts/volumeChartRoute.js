const express = require("express");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");

const volumeChartRoute = express();

volumeChartRoute.get("/volume", async (req, res) => {
  try {
    const { collectionAddress } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const sqlQuery = `SELECT SUM(native_price) AS volume, date_trunc('day', timestamp) AS tx_timestamp
    FROM ethereum.nft_sales
    WHERE contract_address = '${collectionAddress}' AND timestamp >= NOW() - interval '160 hours'
    GROUP BY tx_timestamp
    ORDER BY tx_timestamp DESC`;

    const data = await execTranseposeAPI(sqlQuery);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = volumeChartRoute;
