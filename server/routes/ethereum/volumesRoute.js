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

  const result = await getVolumesLastDays(marketplacesArr, countDays);

  let data = result.reduce((acc, curr) => {
    if (!acc[curr.marketplace]) {
      acc[curr.marketplace] = {
        marketplace: curr.marketplace,
        volumeEth: 0,
        volume: 0,
        traderNum: 0,
        saleNum: 0,
      };
    }
    acc[curr.marketplace].volumeEth += curr.eth_volume;
    acc[curr.marketplace].volume += curr.dollar_volume;
    acc[curr.marketplace].traderNum += curr.active_traders;
    acc[curr.marketplace].saleNum += curr.count_sales;
    return acc;
  }, {});

  data = Object.values(data).map((d) => ({
    name: marketplacesArr.find((m) => m.toLowerCase() === d.marketplace),
    volumeEth: +d.volumeEth.toFixed(2),
    volume: parseInt(d.volume),
    traderNum: d.traderNum,
    saleNum: d.saleNum,
  }));

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
