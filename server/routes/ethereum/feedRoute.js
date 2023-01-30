const express = require("express");
require("dotenv").config();
const checkAuth = require("../../middleware/checkAuth");
const { lruCache } = require("../../services/cache/lru");

const feedRoute = express();

feedRoute.get("/list", checkAuth, async (req, res) => {
  const feeds = await lruCache(
    (
      await fetch(
        `https://public-api.luckytrader.com/news?limit=10&offset=10`,
        {
          headers: {
            "x-api-key": "JSeT6UcNZo2JCStayI8KV6aZnYYzBPOX9yHuSKb8",
          },
        }
      )
    ).json(),
    {
      key: `feeds#list`,
      ttl: 60 * 60 * 1000, // 1h,
    }
  );

  async function getData() {
    res.status(200).json(feeds);
  }
  getData();
});

module.exports = feedRoute;
