const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const Ranking = require("../../models/RankingModel");
const { client } = require("../../config/db");

const trendingRoute = express();

trendingRoute.get("/:time", checkAuth, (req, res) => {
  async function getData() {
    try {
      const { time } = req.params;
      const userTime = parseInt(time);

      const rightTime = new Date().getTime() - userTime;

      const trendingColl = await client
        .query(
          `
          SELECT
          salesCount,
          salesVolume,
          sales.contract_address,
          collections.name,
          collections.total_supply,
          collections.floor_price,
          collections.created_date,
          collections.slug,
          collections.image 
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
          )
          as sales 
          LEFT JOIN
             collections 
             ON sales.contract_address = collections.contract_address;
        `
        )
        .catch(e => console.log(e));

      const formattedTrendingColl = trendingColl?.rows?.map(coll => {
        return {
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
        };
      });

      res.status(200).json({ trendingCollections: formattedTrendingColl, time });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = trendingRoute;
