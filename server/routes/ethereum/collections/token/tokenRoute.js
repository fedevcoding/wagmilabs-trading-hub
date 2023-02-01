const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../../middleware/checkAuth");
const { lruCache } = require("../../../../services/cache/lru");

const tokenRoute = express();

tokenRoute.get("/:address/token/:id/details", checkAuth, async (req, res) => {
  const { address, id } = req.params;
  let data = {};

  try {
    const tokenInfo = await lruCache(
      (
        await fetch(
          `https://api.reservoir.tools/tokens/v5?tokens=${address}%3A${id}`,
          {
            headers: {
              accept: "*/*",
              "x-api-key": "9a16bf8e-ec68-5d88-a7a5-a24044de3f38",
            },
          }
        )
      ).json(),
      {
        key: `collection#${address}#token#${id}#details`,
        ttl: 12 * 60 * 60 * 1000, // 12 hours
      }
    );

    if ((tokenInfo?.tokens || [])[0]) {
      data = tokenInfo?.tokens[0];
    }
  } catch (error) {
    // token not found or reservoir error
  }

  async function getData() {
    res.status(200).json(data);
  }
  getData();
});

module.exports = tokenRoute;
