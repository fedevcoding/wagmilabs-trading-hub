const express = require("express");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");
const checkAuth = require("../../../middleware/checkAuth");

const avgPriceChartRoute = express();

avgPriceChartRoute.get("/avgPrice", checkAuth, async (req, res) => {
  try {
    const { collectionAddress, range, granularity } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const sqlQuery = `
    SELECT 
      AVG(native_price) AS avgprice, 
      TIMESTAMP 'epoch' + INTERVAL '1 second' * (FLOOR(EXTRACT(epoch FROM timestamp) / (1 * ${granularity})) * (1 * ${granularity})) AS tx_timestamp
    FROM ethereum.nft_sales
    WHERE contract_address = '${collectionAddress}' AND timestamp >= NOW() - interval '${range} seconds'
    GROUP BY tx_timestamp
    ORDER BY tx_timestamp DESC`;

    const data = await execTranseposeAPI(sqlQuery);

    if (!data || data?.length === 0) throw new Error("No data found");

    data.sort((a, b) => new Date(a.tx_timestamp).getTime() - new Date(b.tx_timestamp).getTime());

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = avgPriceChartRoute;
