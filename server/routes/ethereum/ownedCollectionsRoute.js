const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const { execReservoirApi } = require("../../services/externalAPI/reservoirApi");

const ownedCollectionsRoute = express();

ownedCollectionsRoute.get("/", checkAuth, (req, res) => {
  const { address } = req.userDetails;

  async function getData() {
    try {
      const url = `https://api.reservoir.tools/users/${address}/collections/v2?includeTopBid=true&includeLiquidCount=true&offset=0&limit=100`;
      const result = await execReservoirApi(url);

      const ownedCollections = result?.collections;

      res.json({ ownedCollections });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = ownedCollectionsRoute;
