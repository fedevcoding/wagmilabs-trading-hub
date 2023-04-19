const express = require("express");
const checkAuth = require("../../middleware/checkAuth");
const Minting = require("../../models/MintingModel");
const { client } = require("../../config/db");

const mintingRoute = express();

mintingRoute.get("/:time", checkAuth, (req, res) => {
  async function getData() {
    try {
      const { time } = req.params || {};
      const userTime = parseInt(time);

      const minTime = new Date().getTime() - userTime;

      //   let mintingCollections = await Minting.aggregate([
      //     {
      //       $unwind: "$mints",
      //     },
      //     {
      //       $match: {
      //         "mints.mintTime": { $gt: minTime },
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: "$_id",
      //         uniqueMinters: { $addToSet: "$mints.minterAddress" },
      //         volume: { $sum: "$mints.value" },
      //         firstDoc: { $first: "$$ROOT" },
      //         rightMints: { $sum: "$mints.amount" },
      //       },
      //     },
      //     {
      //       $unset: "firstDoc.mints",
      //     },
      //     {
      //       $match: { rightMints: { $gt: 0 } },
      //     },
      //     {
      //       $addFields: {
      //         "firstDoc.volume": "$volume",
      //         "firstDoc.rightMints": "$rightMints",
      //         "firstDoc.uniqueMinters": { $size: "$uniqueMinters" },
      //       },
      //     },
      //     {
      //       $replaceRoot: {
      //         newRoot: "$firstDoc",
      //       },
      //     },
      //     {
      //       $sort: {
      //         rightMints: -1,
      //       },
      //     },
      //     {
      //       $limit: 50,
      //     },
      //   ]);

      const sql = `
                    SELECT unique_minters, volume, right_mints, collections.name, mints.contract_address, collections.total_supply, collections.floor_price, collections.created_date, collections.slug, collections.image 
                    FROM 
                        (SELECT COUNT(DISTINCT minter_address) as unique_minters, SUM(value) as volume, SUM(amount) as right_mints, contract_address 
                        FROM mints 
                        WHERE timestamp > ${minTime} 
                        GROUP BY contract_address 
                        ORDER BY right_mints DESC 
                        LIMIT 50
                        ) as mints
                    LEFT JOIN collections ON mints.contract_address = collections.contract_address;
        `;

      const mintingCollections = await client.query(sql);

      const formattedMintingColelctions = mintingCollections?.rows?.map(coll => {
        return {
          contractAddress: coll.contract_address,
          creationDate: coll.created_date,
          floor_price: coll.floor_price,
          name: coll.name,
          image: coll.image,
          slug: coll.slug,
          totalMints: coll.total_supply,
          rightMints: coll.right_mints,
          volume: coll.volume,
          uniqueMinters: coll.unique_minters,
          mintPrice: coll.volume / coll.right_mints,
        };
      });

      res.status(200).json({ mintingCollections: formattedMintingColelctions, time });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
  getData();
});

module.exports = mintingRoute;
