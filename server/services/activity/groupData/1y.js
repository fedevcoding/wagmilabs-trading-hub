const { execTranseposeAPI } = require("../../externalAPI/transpose");

const last1y = async (contractAddress) => {
  const days = {};

  // creare un oggetto con le date degli ultimi 365 giorni
  for (let i = 0; i < 26; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i * 7);
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    const weekGroup = parseInt(
      day.getTime() / (2 * 7 * 24 * 3600 * 1000)
    ).toString();
    const dateString = day.toISOString();
    days[weekGroup] = {
      averageprice: 0.00001,
      sales: 0,
      volume: 0.00001,
      day: dateString,
    };
  }

  const query = `
    SELECT AVG(native_price) AS averagePrice, SUM(quantity) AS sales, SUM(native_price) AS volume, date_trunc('day', timestamp) AS day
    FROM ethereum.nft_sales
    WHERE contract_address = '${contractAddress}'
    GROUP BY day
    ORDER BY day DESC
    LIMIT 365`;

  const salesData = await execTranseposeAPI(query);

  // aggiornare l'oggetto delle ore mancanti con i dati delle vendite
  salesData.forEach((data) => {
    const date = new Date(data.day);
    const weekGroup = parseInt(
      date.getTime() / (2 * 7 * 24 * 3600 * 1000)
    ).toString();
    const day = date.toISOString();
    days[weekGroup] = {
      averageprice: data.averageprice,
      sales: data.sales,
      volume: data.volume,
      day,
    };
  });

  return Object.values(days);
};

module.exports = {
  last1y,
};
