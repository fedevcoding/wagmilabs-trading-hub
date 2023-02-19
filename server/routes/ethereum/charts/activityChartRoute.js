const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../middleware/checkAuth.js");
const { last24h } = require("../../../services/activity/groupData/24h.js");
const { last30d } = require("../../../services/activity/groupData/30d.js");
const { last7d } = require("../../../services/activity/groupData/7d.js");

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

  data = data.sort((a, b) => a.day.localeCompare(b.day));

  res.json(data);
});

module.exports = activityChartRoute;
