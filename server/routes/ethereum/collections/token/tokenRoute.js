const express = require("express");
require("dotenv").config();
const checkAuth = require("../../../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../../../services/externalAPI/transpose");
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;
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
            "x-api-key": RESERVOIR_API_KEY,
          },
        }
      )
    ).json();

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

tokenRoute.get("/:address/token/:id/activities", checkAuth, async (req, res) => {
  const { address, id } = req.params;
  let { types, continuation } = req.query;
  let tokenActivities = {};

  const params = {};
  if (types && !types.includes(",")) {
    params.types = types;
  }
  if (continuation && continuation !== "undefined") {
    params.continuation = continuation;
  }

  let urlSearchParams = new URLSearchParams(params).toString();
  if (types && types.includes(",")) {
    urlSearchParams += "types=" + types.split(",").join("&types=");
  }

  try {
    tokenActivities = await (
      await fetch(`https://api.reservoir.tools/tokens/${address}%3A${id}/activity/v4?${urlSearchParams}`, {
        headers: {
          accept: "*/*",
          "x-api-key": RESERVOIR_API_KEY,
        },
      })
    ).json();
  } catch (error) {
    // token not found or reservoir error
  }

  async function getData() {
    res.status(200).json(tokenActivities);
  }
  getData();
});

tokenRoute.get("/:address/token/:id/total-supply", checkAuth, async (req, res) => {
  const { address, id } = req.params;
  let totalSupply = null;

  try {
    totalSupply = (
      await execTranseposeAPI(
        `SELECT SUM(balance) AS total_supply FROM ethereum.nft_owners WHERE contract_address = '${address}' and token_id = '${id}'`
      )
    )[0].total_supply;
  } catch (error) {
    // token not found or reservoir error
  }

  async function getData() {
    res.status(200).json({
      totalSupply,
    });
  }
  getData();
});

module.exports = tokenRoute;
