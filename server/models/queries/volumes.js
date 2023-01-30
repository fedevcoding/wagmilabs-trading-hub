const Marketplaces = require("../../models/MarketplacesModel");
const {
  groupBy2Weeks,
  groupByMonth,
  groupByWeek,
} = require("../../services/volumes/utils");

const groupData = (data, countDays, elements) => {
  if (countDays === "180") {
    data = groupByWeek(data, elements);
  }
  if (countDays === "365") {
    data = groupBy2Weeks(data, elements);
  }
  if (countDays === "all") {
    data = groupByMonth(data, elements);
  }
  return data;
};

const findMarketplaceVolumes = async (marketplace, countDays, fields) => {
  return (
    await Marketplaces.find(
      {
        marketplace,
      },
      fields
    )
      .limit(countDays === "all" ? 365 * 10 : countDays)
      .sort({ createdAt: "desc" })
  ).sort(
    (x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime()
  );
};

const getVolumesLastDays = async (marketplaces, countDays) => {
  const result = [];
  for (const m of marketplaces) {
    const pipeline = [
      {
        $match: {
          marketplace: m.toLowerCase(),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: countDays === "all" ? 365 * 10 : parseInt(countDays),
      },
      {
        $group: {
          _id: "$marketplace",
          volumeEth: { $sum: "$eth_volume" },
          volume: { $sum: "$dollar_volume" },
          traderNum: { $sum: "$active_traders" },
          saleNum: { $sum: "$count_sales" },
        },
      },
    ];
    const data = (await Marketplaces.aggregate(pipeline).exec())[0];
    result.push({
      ...data,
      volume: parseInt(data.volume),
      name: m,
      volumeEth: +data.volumeEth.toFixed(2),
    });
  }
  return result;
};

const getVolumes = async (marketplace, countDays) => {
  return groupData(
    (
      await findMarketplaceVolumes(marketplace, countDays, {
        createdAt: 1,
        _id: 0,
        eth_volume: 1,
        dollar_volume: 1,
        day: 1,
      })
    ).map((x) => ({
      volume_eth: +Number(x.eth_volume).toFixed(2),
      volume: parseInt(x.dollar_volume),
      ts: x.day,
    })),
    countDays,
    ["volume_eth", "volume"]
  );
};

const getVolumeSales = async (marketplace, countDays) => {
  return groupData(
    (
      await findMarketplaceVolumes(marketplace, countDays, {
        createdAt: 1,
        _id: 0,
        count_sales: 1,
        day: 1,
      })
    ).map((x) => ({
      sales: x.count_sales,
      ts: x.day,
    })),
    countDays,
    ["sales"]
  );
};

const getVolumeActiveTraders = async (marketplace, countDays) => {
  return groupData(
    (
      await findMarketplaceVolumes(marketplace, countDays, {
        createdAt: 1,
        _id: 0,
        active_traders: 1,
        day: 1,
      })
    ).map((x) => ({
      active_traders: x.active_traders,
      ts: x.day,
    })),
    countDays,
    ["active_traders"]
  );
};

const getVolumeComparison = async (marketplace, countDays) => {
  return groupData(
    (
      await findMarketplaceVolumes(marketplace, countDays, {
        createdAt: 1,
        _id: 0,
        count_eth_sales: 1,
        count_weth_sales: 1,
        day: 1,
      })
    ).map((x) => ({
      count_eth_sales: x.count_eth_sales,
      count_weth_sales: x.count_weth_sales,
      ts: x.day,
    })),
    countDays,
    ["count_eth_sales", "count_weth_sales"]
  );
};

module.exports = {
  getVolumes,
  getVolumeSales,
  getVolumeActiveTraders,
  getVolumeComparison,
  getVolumesLastDays,
};
