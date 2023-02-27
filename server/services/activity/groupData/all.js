const { execTranseposeAPI } = require("../../externalAPI/transpose");

const allTime = async (contractAddress) => {
  const days = {};

  const query = `
    SELECT AVG(native_price) AS averagePrice, SUM(quantity) AS sales, SUM(native_price) AS volume, date_trunc('day', timestamp) AS day
    FROM ethereum.nft_sales
    WHERE contract_address = '${contractAddress}'
    GROUP BY day
    ORDER BY day DESC`;

  const salesData = await execTranseposeAPI(query);

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
  allTime,
};
