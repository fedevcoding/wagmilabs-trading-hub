const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const { lruCache } = require("../../../services/cache/lru");
const { getTrendingData } = require("./utils");
const { refreshTrending } = require("./cron");
const checkTrendingPro = require("./middlewares/checkTrendingPro");

const trendingRoute = express();

refreshTrending();

trendingRoute.get("/:time", checkAuth, checkTrendingPro, (req, res) => {
  async function getData() {
    try {
      const { time } = req.params;

      const data = await lruCache(async () => {}, {
        key: `trendingCollections:${time}`,
        ttl: 20000,
      });

      res.status(200).json({ trendingCollections: data, time });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = trendingRoute;
