const express = require("express");
require("dotenv").config();
const checkAuth = require("../../middleware/checkAuth");
const { lruCache } = require("../../services/cache/lru");

const feedRoute = express();

feedRoute.get("/list", checkAuth, async (req, res) => {
  const limit = 20;
  const { page } = req.query;

  const feeds = await lruCache(
    (
      await fetch(
        `https://public-api.luckytrader.com/news?limit=${limit}&offset=${
          (page - 1) * limit
        }`,
        {
          headers: {
            "x-api-key": "JSeT6UcNZo2JCStayI8KV6aZnYYzBPOX9yHuSKb8",
          },
        }
      )
    ).json(),
    {
      key: `feeds#list${page}`,
      ttl: 30 * 60 * 1000, // 30 min,
    }
  );

  async function getData() {
    res.status(200).json(feeds);
  }
  getData();
});

module.exports = feedRoute;
