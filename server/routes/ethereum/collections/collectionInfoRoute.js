const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const Stats = require("../../../models/StatsModel");

const collectionInfoRoute = express();

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;

collectionInfoRoute.get("/:address", checkAuth, (req, res) => {
  // const { address: userAddress } = req.userDetails || {};

  async function getData() {
    try {
      const { address } = req.params;
      const dataApi = await fetch(
        `https://api.reservoir.tools/collections/v5?id=${address}&includeTopBid=true&includeAttributes=false&includeOwnerCount=false&includeSalesCount=false&normalizeRoyalties=false`,
        {
          headers: {
            "x-api-key": RESERVOIR_API_KEY,
          },
        }
      );
      const data = (await dataApi.json())?.collections?.[0];

      if (!data) return res.status(200).json({ exists: false, error: "Collection not found" });

      const attributesApi = await fetch(`https://api.reservoir.tools/collections/${address}/attributes/all/v2`);
      const { attributes } = await attributesApi.json();

      data["attributes"] = attributes;
      res.status(200).json({ data, exists: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }
  getData();
});

module.exports = collectionInfoRoute;
