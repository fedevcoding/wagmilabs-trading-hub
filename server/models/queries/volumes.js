const getQueryDate = (grupByWeek) => {
  return grupByWeek
    ? `(extract(epoch from timestamp) / (7*24*60*60))::numeric::integer AS ts,
            MIN(timestamp) AS timestamp,`
    : `DATE_TRUNC('day', timestamp) AS ts,`;
};

const execTranseposeAPI = async (sql) => {
  const result = await fetch("https://api.transpose.io/sql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.TRANSPOSE_API,
    },
    body: JSON.stringify({
      sql,
    }),
  });

  return (await result.json()).results;
};

const getVolumes = async (marketplace, interval) => {
  const grupByWeek = interval === "180 days";
  const date = getQueryDate(grupByWeek);

  const result = await execTranseposeAPI(`SELECT
    ${date}
    SUM(eth_price) AS volume_eth,
    SUM(usd_price) AS volume
    FROM ethereum.${marketplace.toLowerCase()}_nft_sales
    WHERE ${
      interval === "all" ? "1" : `timestamp >= (NOW() - INTERVAL '${interval}')`
    }
    GROUP BY ts
    ORDER BY ts DESC;`);

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
    FROM ethereum.${marketplace.toLowerCase()}_nft_sales
    WHERE ${
      interval === "all" ? "1" : `timestamp >= (NOW() - INTERVAL '${interval}')`
    }
    GROUP BY ts
    ORDER BY ts DESC;`);

  return grupByWeek
    ? result.map((r) => ({
        sales: r.sales,
        ts: r.timestamp,
      }))
    : result;
};

module.exports = {
  getVolumes,
  getVolumeSales,
};
