const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");

const profileItemsRoute = express();

const RESERVOIR_API_KEY = "9fc22ad1-29da-4a2d-a977-327f6bf1926f";

profileItemsRoute.get("/", checkAuth, async (req, res) => {
  try {
    const userAddress = req.query?.address || req.userDetails?.address;
    const { sortDirection, collection, continuation, limit = "50" } = req.query;

    const continuationFilter = continuation ? `&continuation=${continuation}` : "";

    async function getTokens() {
      const filterCollectionQuery = collection && collection !== "undefined" ? `&collection=${collection}` : "";

      const sortDirectionCondition = sortDirection ? `&sortDirection=${sortDirection}` : "";

      let items = await fetch(
        `https://api.reservoir.tools/users/${userAddress}/tokens/v6?normalizeRoyalties=false${sortDirectionCondition}&limit=${limit}&includeTopBid=false${filterCollectionQuery}${continuationFilter}`,
        {
          headers: {
            accept: "*/*",
            "x-api-key": RESERVOIR_API_KEY,
          },
        }
      );
      items = await items.json();

      const { tokens, continuation } = items;

      res.status(200).json({ tokens, continuation, ok: true });
    }
    getTokens();
  } catch (e) {
    res.status(400).json({ ok: false, userCollections });
  }
});

module.exports = profileItemsRoute;
