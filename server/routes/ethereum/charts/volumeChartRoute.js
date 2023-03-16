const express = require("express");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");

const volumeChartRoute = express();

const processData = salesData => {};

volumeChartRoute.get("/volume", async (req, res) => {
  try {
    const { collectionAddress, range, granularity } = req.query;

    console.log(range, granularity);

    if (!collectionAddress) throw new Error("Collection address is required");

    const sqlQuery = `
    SELECT 
      SUM(native_price) AS volume, 
      TIMESTAMP 'epoch' + INTERVAL '1 second' * (FLOOR(EXTRACT(epoch FROM timestamp) / (1 * ${granularity})) * (1 * ${granularity})) AS tx_timestamp
    FROM ethereum.nft_sales
    WHERE contract_address = '${collectionAddress}' AND timestamp >= NOW() - interval '${range} seconds'
    GROUP BY tx_timestamp
    ORDER BY tx_timestamp DESC`;

    const data = await execTranseposeAPI(sqlQuery);

    data.sort((a, b) => new Date(a.tx_timestamp).getTime() - new Date(b.tx_timestamp).getTime());

    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = volumeChartRoute;
