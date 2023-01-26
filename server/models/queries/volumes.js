const { execTranseposeAPI } = require("../../services/externalAPI/transpose");

const getQueryDate = (grupByWeek) => {
  return grupByWeek
    ? `(extract(epoch from timestamp) / (7*24*60*60))::numeric::integer AS ts,
            MIN(timestamp) AS timestamp,`
    : `DATE_TRUNC('day', timestamp) AS ts,`;
};

const getVolumes = async (marketplace, interval) => {
  const grupByWeek = interval === "180 days";
  const date = getQueryDate(grupByWeek);

  const result = await execTranseposeAPI(`SELECT
    ${date}
    SUM(eth_price) AS volume_eth,
    SUM(usd_price) AS volume
    FROM ethereum.nft_sales
    WHERE ${
      interval === "all" ? "1" : `timestamp >= (NOW() - INTERVAL '${interval}')`
    }
    AND exchange_name = '${marketplace.toLowerCase()}'
    GROUP BY ts
    ORDER BY ts ASC;`);

  return (
    grupByWeek
      ? result.map((r) => ({
          volume_eth: r.volume_eth,
          volume: r.volume,
          ts: r.timestamp,
        }))
      : result
  ).map((r) => ({
    ...r,
    volume_eth: +Number(r.volume_eth).toFixed(2),
    volume: parseInt(r.volume),
  }));
};

module.exports = {
  getVolumes,
};

const getVolumeSales = async (marketplace, interval) => {
  const grupByWeek = interval === "180 days";
  const date = getQueryDate(grupByWeek);

  const result = await execTranseposeAPI(`SELECT
    ${date}
    count(*) AS sales
    FROM ethereum.nft_sales
    WHERE ${
      interval === "all" ? "1" : `timestamp >= (NOW() - INTERVAL '${interval}')`
    }
    AND exchange_name = '${marketplace.toLowerCase()}'
    GROUP BY ts
    ORDER BY ts ASC;`);

  return grupByWeek
    ? result.map((r) => ({
        sales: r.sales,
        ts: r.timestamp,
      }))
    : result;
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
