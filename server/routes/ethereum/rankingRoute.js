const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const Ranking = require("../../models/RankingModel");
const { client } = require("../../config/db");

const rankingRoute = express();

rankingRoute.get("/:time", checkAuth, (req, res) => {
  async function getData() {
    try {
      const { time } = req.params || {};
      const userTime = parseInt(time);

      const rightTime = new Date().getTime() - userTime;

      const rankingColl = await client
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
         salesVolume DESC LIMIT 50 
      )
      as sales 
      LEFT JOIN
         collections 
         ON sales.contract_address = collections.contract_address;
    `
        )
        .catch(e => console.log(e));

      const formattedRankingColl = rankingColl?.rows?.map(coll => {
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

      res.status(200).json({ rankingCollections: formattedRankingColl, time });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = rankingRoute;
