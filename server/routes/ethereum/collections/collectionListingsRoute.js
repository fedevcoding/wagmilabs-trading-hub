const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const Listings = require("../../../models/ListingsModel");

const collectionListingsRoute = express();

collectionListingsRoute.get("/:address", checkAuth, (req, res) => {
  async function getListings() {
    try {
      const { address } = req.params;

      if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" });

      const lowerCased = address.toLowerCase();

      // const totalListings = (await Listings.findOne({ contractAddress: lowerCased }, { listings: { $slice: -2000 } }))
      // ?.listings;

      const sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;

      const totalListings = (
        await Listings.aggregate([
          { $match: { contractAddress: lowerCased } },
          { $match: { "listings.timestamp": { $gte: sevenDaysAgo } } },
          { $unwind: "$listings" },
          { $sort: { "listings.timestamp": -1 } },
          { $group: { _id: "$contractAddress", listings: { $push: "$listings" } } },
          { $project: { _id: 0, listings: { $slice: ["$listings", 2000] } } },
        ])
      )[0].listings;

      res.status(200).json({ totalListings, status: "success", ok: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getListings();
});

module.exports = collectionListingsRoute;
