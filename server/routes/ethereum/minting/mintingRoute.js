const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const { prisma } = require("../../../config/db");
const checkMintingPro = require("./middlewares/checkMintingPro");

const mintingRoute = express();

mintingRoute.get("/:time", checkAuth, checkMintingPro, (req, res) => {
  async function getData() {
    try {
      const { time } = req.params || {};
      const userTime = parseInt(time);

      const minTime = new Date(new Date().getTime() - userTime).toISOString();

      const mintingCollections = await prisma.$queryRaw`
SELECT
    unique_minters,
    volume,
    right_mints,
    collection.contract_address,
    collection.name,
    collection.total_supply,
    collection.floor_price,
    collection.created_at,
    collection.slug,
    collection.image
FROM
    (
        SELECT
            COUNT(DISTINCT m.minter_address) as unique_minters,
            SUM(m.value) as volume,
            COUNT(*) as right_mints,
            m.contract_address
        FROM
            mint m
        WHERE
            m.timestamp > ${minTime}::timestamp
        GROUP BY
            m.contract_address
        ORDER BY
            right_mints DESC
        LIMIT 50
    ) as mints
LEFT JOIN
    collection
ON
    mints.contract_address = collection.contract_address;
         `.catch(e => console.log(e));

      const formattedMintingColelctions = mintingCollections?.map(coll => {
        return {
          contractAddress: coll.contract_address,
          creationDate: coll.created_at,
          floor_price: coll.floor_price,
          name: coll.name,
          image: coll.image,
          slug: coll.slug,
          totalMints: parseInt(coll.total_supply),
          rightMints: parseInt(coll.right_mints),
          volume: parseInt(coll.volume),
          uniqueMinters: parseInt(coll.unique_minters),
          mintPrice: parseInt(coll.volume) / parseInt(coll.right_mints),
        };
      });

      res.status(200).json({ mintingCollections: formattedMintingColelctions, time });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = mintingRoute;
