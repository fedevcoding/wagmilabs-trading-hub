const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../middleware/checkAuth.js");
const { last24h, last30d, last7d, last3m, last1y, allTime } = require("../../../services/activity/groupData");

const activityChartRoute = express();

activityChartRoute.get("/:contractAddress", checkAuth, async (req, res) => {
  const { contractAddress } = req.params;
  const period = req.query["chart-period"];

  let data = [];
  if (period === "24h") {
    data = await last24h(contractAddress);
  }
  if (period === "7d") {
    data = await last7d(contractAddress);
  }
  if (period === "30d") {
    data = await last30d(contractAddress);
  }
  if (period === "3M") {
    data = await last3m(contractAddress);
  }
  if (period === "1y") {
    data = await last1y(contractAddress);
  }
  if (period === "all") {
    data = await allTime(contractAddress);
  }

  data = data.sort((a, b) => a.day.localeCompare(b.day));

  res.json(data);
});

module.exports = activityChartRoute;
