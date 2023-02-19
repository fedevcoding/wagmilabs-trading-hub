const { execTranseposeAPI } = require("../../externalAPI/transpose");

const last24h = async (contractAddress) => {
  const hours = {};

  // creare un oggetto con le ore delle ultime 24 ore
  const start = new Date();
  start.setHours(start.getHours() - 24);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  const end = new Date();
  end.setMinutes(0);
  end.setSeconds(0);
  end.setMilliseconds(0);
  for (
    let hour = new Date(start);
    hour < end;
    hour.setHours(hour.getHours() + 1)
  ) {
    const day = hour.toISOString();
    hours[day] = { averageprice: 1, sales: 0, volume: 1, day: day };
  }

  const query = `
    SELECT AVG(native_price) AS averagePrice, SUM(quantity) AS sales, SUM(native_price) AS volume, date_trunc('hour', timestamp) AS day
    FROM ethereum.nft_sales
    WHERE contract_address = '${contractAddress}' AND timestamp >= NOW() - interval '24 hours'
    GROUP BY day
    ORDER BY day DESC`;

  const salesData = await execTranseposeAPI(query);

  // aggiornare l'oggetto delle ore mancanti con i dati delle vendite
  salesData.forEach((data) => {
    const hour = new Date(data.day).toISOString();
    hours[hour] = {
      averageprice: data.averageprice,
      sales: data.sales,
      volume: data.volume,
      day: hour,
    };
  });

  return hours;
};

module.exports = {
  last24h,
};
