const express = require("express");
require("dotenv").config();
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

const getVolumes = async (marketplace, interval) => {
  const volumes = await fetch("https://api.transpose.io/sql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.TRANSPOSE_API,
    },
    body: JSON.stringify({
      sql: `SELECT
      DATE_TRUNC('day', timestamp) AS ts,
      SUM(eth_price) AS volume_eth,
      SUM(usd_price) AS volume
      FROM ethereum.${marketplace.toLowerCase()}_nft_sales
      WHERE ${
        interval === "all"
          ? "1"
          : `timestamp >= (NOW() - INTERVAL '${interval}')`
      }
      GROUP BY ts
      ORDER BY ts DESC;`,
    }),
  });

  /*
  group by week

  SELECT
      (extract(epoch from timestamp) / (7*24*60*60))::numeric::integer AS ts,
      SUM(eth_price) AS volume_eth,
      SUM(usd_price) AS volume
      FROM ethereum.opensea_nft_sales
      WHERE timestamp >= (NOW() - INTERVAL '180 days')
      GROUP BY ts
      ORDER BY ts asc;

  */

  return (await volumes.json()).results.map((r) => ({
    ...r,
    volume_eth: +Number(r.volume_eth).toFixed(2),
    volume: parseInt(r.volume),
  }));
};

volumesRoute.get("/:marketplace", checkAuth, async (req, res) => {
  const { period, filter } = req.query;

  const intervals = {
    "30d": "30 days",
    "6m": "180 days",
    "1y": "1 year",
    all: "all",
  };
  const interval = intervals[period?.toLowerCase() || "30d"] || "30 days";

  const marketplaces = ["opensea", "blur", "x2y2", "looksrare", "sudoswap"];
  const marketplace = marketplaces.includes(req.params.marketplace)
    ? req.params.marketplace
    : "opensea";

  const volumes = await getVolumes(marketplace, interval);

  async function getData() {
    res.status(200).json(
      filter === "volumes"
        ? volumes
        : {
            volumes: volumes,
            sales: {},
            activeTraders: {},
            comparisonData: {},
          }
    );
  }
  getData();
});

module.exports = volumesRoute;
