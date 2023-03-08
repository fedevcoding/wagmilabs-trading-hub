const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../middleware/checkAuth");
const { lruCache } = require("../../../services/cache/lru");

const holdersRoute = express();

holdersRoute.get("/:address/get-holders", checkAuth, async (req, res) => {
  const { address } = req.params;
  const { sort, direction } = req.query;
  let data = {};

  try {
    data = await lruCache(
      (
        await fetch(
          `https://api.upshot.xyz/v2/collections/${address}/holders?sort_order=${sort}&sort_direction=${direction}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-api-key": process.env.UPSHOT_API_KEY,
            },
          }
        )
      ).json(),
      {
        key: `upshot#collections#${address}#holders#sort${sort}#direction${direction}`,
        ttl: 12 * 60 * 60 * 1000, // 12h,
      }
    );
  } catch (error) {
    // token not found or upshot api error
    console.log(error);
  }

  async function getData() {
    res.status(200).json(data);
  }
  getData();
});

module.exports = holdersRoute;
