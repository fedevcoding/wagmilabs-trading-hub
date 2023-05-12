const { client } = require("../../../config/db");

async function getTrendingData() {
  const intervals = [60000, 120000, 300000, 600000, 1800000, 3600000, 14400000, 43200000, 86400000, 604800000];

  const subqueries = intervals.map(time => {
    const userTime = parseInt(time);
    const rightTime = new Date().getTime() - userTime;
    const sevenDays = new Date().getTime() - 604800000;

    return `
      SELECT
        ${time} AS time_interval,
        sales.salesCount,
        sales.salesVolume,
        sales.contract_address,
        collections.name,
        collections.total_supply,
        collections.floor_price,
        collections.created_date,
        collections.slug,
        collections.image,
        daily_floors.daily_floor
      FROM
        (
          SELECT
            COUNT(1) as salesCount,
            SUM(value) as salesVolume,
            contract_address
          FROM
            sales
          WHERE
            timestamp >= ${rightTime}
          GROUP BY
            contract_address
          ORDER BY
            salesCount DESC LIMIT 50
        ) as sales
        LEFT JOIN collections ON sales.contract_address = collections.contract_address
        INNER JOIN
        (
          SELECT
            contract_address,
            json_build_object('daily_floors', json_agg(json_build_object('day', day, 'daily_floor', daily_floor))) AS daily_floor
          FROM
            (
              SELECT
                date_trunc('day', to_timestamp(timestamp / 1000.00)) AS day,
                AVG(floor_price) as daily_floor,
                contract_address
              FROM
                floor_changes
              WHERE
                contract_address IN (
                  SELECT
                    contract_address
                  FROM
                    (
                      SELECT
                        COUNT(1) as salesCount,
                        SUM(value) as salesVolume,
                        contract_address
                      FROM
                        sales
                      WHERE
                        timestamp >= ${rightTime}
                      GROUP BY
                        contract_address
                      ORDER BY
                        salesCount DESC LIMIT 50
                    ) as ranked_contracts
                )
                AND timestamp >= ${sevenDays}
              GROUP BY
                day, contract_address
              ORDER BY day DESC
            ) daily_floors
          GROUP BY
            contract_address
        ) AS daily_floors
        ON sales.contract_address = daily_floors.contract_address
    `;
  });

  const combinedQuery = subqueries.join(" UNION ALL ");

  const trendingColl = await client.query(combinedQuery).catch(e => console.log(e));

  const formattedTrendingColl = trendingColl?.rows?.map(coll => {
    return {
      timeInterval: coll.time_interval,
      contractAddress: coll.contract_address,
      creationDate: coll.created_date,
      floorStats: {},
      floor_price: coll.floor_price,
      name: coll.name,
      image: coll.image,
      slug: coll.slug,
      totalSupply: coll.total_supply,
      rightSales: coll.salescount,
      volume: coll.salesvolume,
      volumeStats: {},
      dailyFloor: coll.daily_floor,
    };
  });

  console.log("done");

  return formattedTrendingColl;
}

module.exports = { getTrendingData };
