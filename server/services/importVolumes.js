const { execTranseposeAPI } = require("./externalAPI/transpose");
const Marketplaces = require("./../models/MarketplacesModel");

// Start date
let start = new Date("2018-01-01");
// End date
let end = new Date();
// Loop through each day
let dates = {};
while (start <= end) {
  // Format the date as "YYYY-MM-DD"
  let date = start.toISOString().slice(0, 10);
  dates[date] = date;

  // Move to the next day
  start.setDate(start.getDate() + 1);
}

dates = Object.values(dates);

(async () => {
  for (const k in dates) {
    const date = dates[k];

    if (dates[parseInt(k) + 1]) {
      const next = dates[parseInt(k) + 1];
      const sql = `WITH data_query AS (
                  SELECT
                    to_char(DATE_TRUNC('day', timestamp), 'YYYY-MM-DD') AS "day",
                    SUM(eth_price) AS eth_volume,
                    SUM(usd_price) AS dollar_volume,
                    count(*) AS count_sales,
                    COUNT(CASE WHEN payment_token_address = '0x0000000000000000000000000000000000000000' THEN 1 END) as count_eth_sales,
                    COUNT(CASE WHEN payment_token_address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' THEN 1 END) as count_weth_sales,
                    exchange_name as marketplace
                  FROM ethereum.nft_sales
                  WHERE timestamp >= '${date}T00:00:00Z' AND timestamp < '${next}T00:00:00Z' and exchange_name IN('opensea', 'blur', 'x2y2', 'sudoswap', 'looksrare')
                  GROUP BY "day", "marketplace"
                ), traders_query AS (
                  SELECT
                    to_char(DATE_TRUNC('day', timestamp), 'YYYY-MM-DD') AS "day",
                    COUNT(DISTINCT address) AS active_traders,
                    marketplace
                  FROM (
                    SELECT seller_address as address, timestamp, exchange_name as marketplace
                    FROM ethereum.nft_sales
                    WHERE timestamp >= '${date}T00:00:00Z' AND timestamp < '${next}T00:00:00Z' and exchange_name IN('opensea', 'blur', 'x2y2', 'sudoswap', 'looksrare')
                    UNION
                    SELECT buyer_address as address, timestamp, exchange_name as marketplace
                    FROM ethereum.nft_sales
                    WHERE timestamp >= '${date}T00:00:00Z' AND timestamp < '${next}T00:00:00Z' and exchange_name IN('opensea', 'blur', 'x2y2', 'sudoswap', 'looksrare')
                  ) as traders
                  GROUP BY "day", "marketplace"
                )
                SELECT
                  data_query."day",
                  data_query.eth_volume,
                  data_query.dollar_volume,
                  data_query.count_sales,
                  data_query.count_eth_sales,
                  data_query.count_weth_sales,
                  traders_query.active_traders,
                  data_query.marketplace
                FROM data_query
                JOIN traders_query
                ON data_query."day" = traders_query."day" AND data_query."marketplace" = traders_query."marketplace"
                ORDER BY data_query."day" desc;`;

      const result = await execTranseposeAPI(sql);

      for (const obj of result) {
        await Marketplaces.create(obj);
      }
    }
  }
})();
