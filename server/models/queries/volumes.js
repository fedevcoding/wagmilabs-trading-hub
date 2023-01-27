const Marketplaces = require("../../models/MarketplacesModel");
const { execTranseposeAPI } = require("../../services/externalAPI/transpose");
const {
  groupBy2Weeks,
  groupByMonth,
  groupByWeek,
} = require("../../services/volumes/utils");

const getQueryDate = (grupByWeek) => {
  return grupByWeek
    ? `(extract(epoch from timestamp) / (7*24*60*60))::numeric::integer AS ts,
            MIN(timestamp) AS timestamp,`
    : `DATE_TRUNC('day', timestamp) AS ts,`;
};

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

const getVolumeActiveTraders = async (marketplace, interval) => {
  const grupByWeek = interval === "180 days";
  const date = getQueryDate(grupByWeek);

  const where = `WHERE ${
    interval === "all" ? "1" : `timestamp >= (NOW() - INTERVAL '${interval}')`
  } AND exchange_name = '${marketplace.toLowerCase()}'`;

  const result = await execTranseposeAPI(`SELECT
    ${date}
    COUNT(DISTINCT address) AS active_traders
    FROM (
        SELECT seller_address as address, timestamp
        FROM ethereum.nft_sales
        ${where}
        UNION
        SELECT buyer_address as address, timestamp
        FROM ethereum.nft_sales
        ${where}
    ) as traders
    GROUP BY ts
    ORDER BY ts ASC;`);

  return grupByWeek
    ? result.map((r) => ({
        active_traders: r.active_traders,
        ts: r.timestamp,
      }))
    : result;
};

module.exports = {
  getVolumes,
  getVolumeSales,
  getVolumeActiveTraders,
};
