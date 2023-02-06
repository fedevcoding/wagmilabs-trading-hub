const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../../middleware/checkAuth");
const { lruCache } = require("../../../../services/cache/lru");

const tokenRoute = express();

tokenRoute.get("/:address/token/:id/details", checkAuth, async (req, res) => {
  const { address, id } = req.params;
  let data = {};

  try {
    const tokenInfo = await (
      await fetch(
        `https://api.reservoir.tools/tokens/v5?tokens=${address}%3A${id}&includeTopBid=true&includeAttributes=true&includeQuantity=true&includeDynamicPricing=true`,
        {
          headers: {
            accept: "*/*",
            "x-api-key": "9a16bf8e-ec68-5d88-a7a5-a24044de3f38",
          },
        }
      )
    ).json();

    console.log(tokenInfo);

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

tokenRoute.get(
  "/:address/token/:id/activities",
  checkAuth,
  async (req, res) => {
    const { address, id } = req.params;
    let tokenActivities = {};

    try {
      tokenActivities = await (
        await fetch(
          `https://api.reservoir.tools/tokens/${address}%3A${id}/activity/v4`,
          {
            headers: {
              accept: "*/*",
              "x-api-key": "9a16bf8e-ec68-5d88-a7a5-a24044de3f38",
            },
          }
        )
      ).json();
    } catch (error) {
      // token not found or reservoir error
    }

    async function getData() {
      res.status(200).json(tokenActivities);
    }
    getData();
  }
);

module.exports = tokenRoute;
