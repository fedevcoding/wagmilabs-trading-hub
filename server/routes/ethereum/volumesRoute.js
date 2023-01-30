const express = require("express");
require("dotenv").config();
const checkAuth = require("../../middleware/checkAuth");
const {
  getVolumes,
  getVolumeSales,
  getVolumeActiveTraders,
  getVolumeComparison,
  getVolumesLastDays,
} = require("../../models/queries/volumes");

const { lruCache } = require("../../services/cache/lru");

const volumesRoute = express();

const getCountDays = (period) => {
  const days = {
    "24h": "1",
    "7d": "7",
    "30d": "30",
    "3m": "30",
    "6m": "180",
    "1y": "365",
    all: "all",
  };
  return days[period?.toLowerCase() || "30d"] || "30";
};

volumesRoute.get("/overview", checkAuth, async (req, res) => {
  const { period, marketplaces } = req.query;
  const marketplacesArr = marketplaces.split(",");
  const countDays = getCountDays(period);

  const getOverviewData = async (marketplaces, countDays) => {
    return await getVolumesLastDays(marketplaces, countDays);
  };

  const data = await lruCache(getOverviewData(marketplacesArr, countDays), {
    key: `volumes#overview#${marketplacesArr.join()}#${countDays}`,
    ttl: 3 * 60 * 60 * 1000, // 3h,
  });

  async function getData() {
    res.status(200).json(data);
  }
  getData();
});

volumesRoute.get("/:marketplace", checkAuth, async (req, res) => {
  const { period, filter } = req.query;
  const ttl = 6 * 60 * 60 * 1000; // 6h
  const countDays = getCountDays(period);

  const marketplaces = ["opensea", "blur", "x2y2", "looksrare", "sudoswap"];
  const marketplace = marketplaces.includes(req.params.marketplace)
    ? req.params.marketplace
    : "opensea";

  let volumes = {};
  let sales = {};
  let activeTraders = {};
  let comparisonData = {};

  if (!filter) {
    [volumes, sales, activeTraders, comparisonData] = await Promise.all([
      lruCache(getVolumes(marketplace, countDays), {
        key: `volumes#${marketplace}#${countDays}`,
        ttl,
      }),
      lruCache(getVolumeSales(marketplace, countDays), {
        key: `volumes#sales#${marketplace}#${countDays}`,
        ttl,
      }),
      lruCache(getVolumeActiveTraders(marketplace, countDays), {
        key: `volumes#active-traders#${marketplace}#${countDays}`,
        ttl,
      }),
      lruCache(getVolumeComparison(marketplace, countDays), {
        key: `volumes#comparison#${marketplace}#${countDays}`,
        ttl,
      }),
    ]);
  } else {
    switch (filter) {
      case "volumes":
        volumes = await lruCache(getVolumes(marketplace, countDays), {
          key: `volumes#${marketplace}#${countDays}`,
          ttl,
        });
        break;
      case "sales":
        sales = await lruCache(getVolumeSales(marketplace, countDays), {
          key: `volumes#sales#${marketplace}#${countDays}`,
          ttl,
        });
        break;
      case "activeTraders":
        activeTraders = await lruCache(
          getVolumeActiveTraders(marketplace, countDays),
          {
            key: `volumes#active-traders#${marketplace}#${countDays}`,
            ttl,
          }
        );
        break;
      case "comparisonData":
        comparisonData = await lruCache(
          getVolumeComparison(marketplace, countDays),
          {
            key: `volumes#comparison#${marketplace}#${countDays}`,
            ttl,
          }
        );
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
