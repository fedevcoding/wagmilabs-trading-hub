const express = require("express");
require("dotenv").config();
const checkAuth = require("../../middleware/checkAuth");
const {
  getVolumes,
  getVolumeSales,
  getVolumeActiveTraders,
} = require("../../models/queries/volumes");

const { lruCache } = require("../../services/cache/lru");

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
  const { period, filter } = req.query;

  const ttl = 6 * 60 * 60 * 1000; // 6h

  const intervals = {
    "10d": "10 days",
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

  let volumes = {};
  let sales = {};
  let activeTraders = {};
  let comparisonData = {};

  if (!filter) {
    [volumes, sales, activeTraders] = await Promise.all([
      lruCache(getVolumes(marketplace, interval), {
        key: `volumes#${marketplace}#${interval}`,
        ttl,
      }),
      lruCache(getVolumeSales(marketplace, interval), {
        key: `volumes#sales#${marketplace}#${interval}`,
        ttl,
      }),
      lruCache(getVolumeActiveTraders(marketplace, interval), {
        key: `volumes#active-traders#${marketplace}#${interval}`,
        ttl,
      }),
    ]);
  } else {
    switch (filter) {
      case "volumes":
        volumes = await lruCache(getVolumes(marketplace, interval), {
          key: `volumes#${marketplace}#${interval}`,
          ttl,
        });
        break;
      case "sales":
        sales = await lruCache(getVolumeSales(marketplace, interval), {
          key: `volumes#sales#${marketplace}#${interval}`,
          ttl,
        });
        break;
      case "activeTraders":
        sales = await lruCache(getVolumeActiveTraders(marketplace, interval), {
          key: `volumes#active-traders#${marketplace}#${interval}`,
          ttl,
        });
        break;
    }
  }

  const result = {
    volumes,
    sales,
    activeTraders,
    comparisonData,
  };

  async function getData() {
    res.status(200).json(filter ? result[filter] : result);
  }
  getData();
});

module.exports = volumesRoute;
