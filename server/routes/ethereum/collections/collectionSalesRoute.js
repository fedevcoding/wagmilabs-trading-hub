const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const Sales = require("../../../models/SalesModel");

const collectionSalesRoute = express();

collectionSalesRoute.get("/:address", checkAuth, (req, res) => {
  async function getSales() {
    try {
      const { address } = req.params;

      if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" });

      const lowerCasedAddress = address.toLowerCase();

      // const totalSales =
      // (await Sales.findOne({ contractAddress: lowerCasedAddress }, { sales: { $slice: -2000 } }))?.sales || [];

      // get all total sales of the last 7 days in descending order
      const sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;

      const totalSales = (
        await Sales.aggregate([
          { $match: { contractAddress: lowerCasedAddress } },
          { $match: { "sales.timestamp": { $gte: sevenDaysAgo } } },
          { $unwind: "$sales" },
          { $sort: { "sales.timestamp": -1 } },
          { $group: { _id: "$contractAddress", sales: { $push: "$sales" } } },
          { $project: { _id: 0, sales: { $slice: ["$sales", 2000] } } },
        ])
      )[0].sales;

      res.status(200).json({ totalSales, status: "success", ok: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getSales();
});

module.exports = collectionSalesRoute;
