const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../middleware/checkAuth.js");
const { last24h } = require("../../../services/activity/groupData/24h.js");

const activityChartRoute = express();

activityChartRoute.get("/:contractAddress", checkAuth, async (req, res) => {
  const { contractAddress } = req.params;
  const period = req.query["chart-period"];

  console.log("period", period);

  /* const query = `
    SELECT AVG(native_price) AS averagePrice, SUM(quantity) AS sales, SUM(native_price) AS volume, date_trunc('day', timestamp) AS day
    FROM ethereum.nft_sales
    WHERE contract_address = '${contractAddress}'
    GROUP BY day
    ORDER BY day DESC
    LIMIT 30`; */

  let data = [];
  if (period === "24h") {
    data = await last24h(contractAddress);
  }

  // restituire i dati completi
  data = Object.entries(data)
    .map(([dateString, values]) => ({ ...values, day: dateString }))
    .sort((a, b) => a.day.localeCompare(b.day));

  res.json(data);
});

module.exports = activityChartRoute;
