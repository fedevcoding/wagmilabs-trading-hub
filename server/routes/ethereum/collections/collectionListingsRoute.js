const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
// const Listings = require("../../../models/ListingsModel");
const { client, prisma } = require("../../../config/db");

const collectionListingsRoute = express();

collectionListingsRoute.get("/:address", checkAuth, (req, res) => {
  async function getListings() {
    try {
      const { address } = req.params;

      if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" });

      const lowerCased = address.toLowerCase();

      // const totalListings = (await Listings.findOne({ contractAddress: lowerCased }, { listings: { $slice: -2000 } }))
      // ?.listings;

      // const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // const totalListings = (
      //   await Listings.aggregate([
      //     { $match: { contractAddress: lowerCased } },
      //     { $match: { "listings.timestamp": { $gte: sevenDaysAgo } } },
      //     { $unwind: "$listings" },
      //     { $sort: { "listings.timestamp": -1 } },
      //     { $group: { _id: "$contractAddress", listings: { $push: "$listings" } } },
      //     { $project: { _id: 0, listings: { $slice: ["$listings", 2000] } } },
      //   ])
      // )[0].listings;

      // const totalListings = [];
      const totalListings = (
        await prisma.$queryRaw`SELECT * FROM listing WHERE contract_address = ${lowerCased} AND valid_from IS NOT NULL ORDER BY valid_from DESC LIMIT 1000`
      )?.map(listing => {
        return {
          ...listing,
          tokenAddress: listing.contract_address,
          orderHash: listing.order_hash,
          tokenId: listing.token_id,
          timestamp: new Date(listing.valid_from).getTime(),
        };
      });
      res.status(200).json({ totalListings, status: "success", ok: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getListings();
});

module.exports = collectionListingsRoute;
