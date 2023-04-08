const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");

const route = express();

const RESERVOIR_API_KEY = "9fc22ad1-29da-4a2d-a977-327f6bf1926f";

route.get("/", checkAuth, async (req, res) => {
  try {
    const { continuation, limit = "200", userAddress } = req.query;
    console.log(userAddress);
    console.log(req.query);

    const continuationFilter = continuation ? `&continuation=${continuation}` : "";

    async function getDistribution() {
      let items = await fetch(
        `https://api.reservoir.tools/users/${userAddress}/tokens/v6?normalizeRoyalties=false&limit=${limit}&includeTopBid=false${continuationFilter}`,
        {
          headers: {
            accept: "*/*",
            "x-api-key": RESERVOIR_API_KEY,
          },
        }
      );
      items = await items.json();

      const { tokens, continuation } = items;

      const tokenCount = tokens.length;

      const collections = {};
      for (const t of tokens) {
        const token = t.token;
        if (!collections[token.contract]) {
          collections[token.contract] = {
            count: 0,
            name: token.collection.name,
          };
        }
        collections[token.contract].count++;
      }
      for (const address in collections) {
        collections[address].distribution = (collections[address].count / tokenCount) * 100;
      }

      const sortedKeys = Object.keys(collections).sort((a, b) => collections[b].count - collections[a].count);
      const topCollections = {};
      let otherCount = 0;

      for (let i = 0; i < sortedKeys.length; i++) {
        const key = sortedKeys[i];
        if (i < 10) {
          topCollections[key] = collections[key];
        } else {
          otherCount += collections[key].count;
        }
      }

      if (otherCount > 0) {
        topCollections.Other = {
          name: "Other",
          count: otherCount,
          distribution: (otherCount / tokenCount) * 100,
        };
      }

      res.status(200).json({ collections: topCollections, tokenCount, continuation, ok: true });
    }
    getDistribution();
  } catch (e) {
    res.status(400).json({ ok: false, userCollections });
  }
});

module.exports = route;
