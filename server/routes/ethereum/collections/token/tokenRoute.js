const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../../middleware/checkAuth");
const { lruCache } = require("../../../../services/cache/lru");

const tokenRoute = express();

tokenRoute.get("/:address/token/:id/details", checkAuth, async (req, res) => {
  const { address, id } = req.params;

  console.log("API", address, id);

  /* const { period, marketplaces } = req.query;
  const marketplacesArr = marketplaces.split(",");
  const countDays = getCountDays(period);

  const getOverviewData = async (marketplaces, countDays) => {
    return await getVolumesLastDays(marketplaces, countDays);
  };

  const data = await lruCache(getOverviewData(marketplacesArr, countDays), {
    key: `volumes#overview#${marketplacesArr.join()}#${countDays}`,
    ttl: 3 * 60 * 60 * 1000, // 3h,
  }); */

  const data = {};

  async function getData() {
    res.status(200).json(data);
  }
  getData();
});

module.exports = tokenRoute;
