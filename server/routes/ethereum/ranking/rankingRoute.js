const express = require("express");
const checkAuth = require("../..//../middleware/checkAuth");
const { prisma } = require("../../../config/db");
const checkRankingPro = require("./middlewares/checkRankingPro");

const rankingRoute = express();

rankingRoute.get("/:time", checkAuth, checkRankingPro, (req, res) => {
  async function getData() {
    try {
      const { time } = req.params || {};
      const userTime = parseInt(time);

      const rightTime = new Date(new Date().getTime() - userTime).toISOString();

      const rankingColl = await prisma.$queryRaw`
      SELECT
      salesCount,
      salesVolume,
      sales.contract_address,
      collection.name,
      collection.total_supply,
      collection.floor_price,
      collection.created_at,
      collection.slug,
      collection.image 
   FROM
      (
         SELECT
            COUNT(*) as salesCount,
            SUM(value) as salesVolume,
            contract_address 
         FROM
            "sale"
         WHERE
            timestamp >= ${rightTime}::timestamp
            AND currency = 'ETH'
         GROUP BY
            contract_address 
         ORDER BY
            salesVolume DESC LIMIT 50
      )
      as sales 
      LEFT JOIN
         "collection"
         ON sales.contract_address = collection.contract_address;
         `.catch(e => console.log(e));

      const formattedRankingColl = rankingColl?.map(coll => {
        return {
          contractAddress: coll.contract_address,
          creationDate: coll.created_at,
          floorStats: {},
          floor_price: coll.floor_price,
          name: coll.name,
          image: coll.image,
          slug: coll.slug,
          totalSupply: coll.total_supply,
          rightSales: parseInt(coll.salescount),
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
