const { execTranseposeAPI } = require("../../externalAPI/transpose");

const last30d = async (contractAddress) => {
  const days = {};

  // creare un oggetto con le date degli ultimi 30 giorni
  for (let i = 0; i < 29; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    const dateString = day.toISOString();
    days[dateString.split("T")[0]] = {
      averageprice: 1,
      sales: 0,
      volume: 1,
      day: dateString,
    };
  }

  const query = `
    SELECT AVG(native_price) AS averagePrice, SUM(quantity) AS sales, SUM(native_price) AS volume, date_trunc('day', timestamp) AS day
    FROM ethereum.nft_sales
    WHERE contract_address = '${contractAddress}'
    GROUP BY day
    ORDER BY day DESC
    LIMIT 30`;

  const salesData = await execTranseposeAPI(query);

  // aggiornare l'oggetto delle ore mancanti con i dati delle vendite
  salesData.forEach((data) => {
    const day = new Date(data.day).toISOString();
    days[day.split("T")[0]] = {
      averageprice: data.averageprice,
      sales: data.sales,
      volume: data.volume,
      day,
    };
  });

  return Object.values(days);
};

module.exports = {
  last30d,
};
