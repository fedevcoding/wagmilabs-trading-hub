const express = require("express");
const checkAuth = require("../../middleware/checkAuth");

const volumesRoute = express();

// currently this endpoint is not used as the call fails due to missing permissions
volumesRoute.get("/", checkAuth, async (req, res) => {
  const { period, marketplaces } = req.query;
  const marketplacesArr = marketplaces.split();

  const nftGoPath = "https://api.nftgo.io/api/v1/ranking/marketplace-list";

  let data = await fetch(
    `${nftGoPath}?limit=100&offset=0&range=${period.toLowerCase()}&fields=volumeEth,traderNum&by=volumeEth&asc=-1&excludeWashTrading=-1`
  );

  console.log("nftgo API", data);

  nftgoData = (await nftgoData.json()).data.list.filter((v) =>
    marketplacesArr.includes(v.name)
  );

  const labels = nftgoData.map((m) => m.name);

  async function getData() {
    res.status(200).json({
      volumes: {
        labels,
        values: nftgoData.map((m) => m.volumeEth),
      },
      traders: {
        labels,
        values: nftgoData.map((m) => m.traderNum),
      },
    });
  }
  getData();
});

volumesRoute.get("/:marketplace", checkAuth, async (req, res) => {
  const { period } = req.query;
  const marketplace = req.params.marketplace;

  /*

  query

  */

  async function getData() {
    res.status(200).json({
      volumes: {},
      sales: {},
      activeTraders: {},
      comparisonData: {},
    });
  }
  getData();
});

module.exports = volumesRoute;
