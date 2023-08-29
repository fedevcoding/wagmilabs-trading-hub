const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
// const Sales = require("../../../models/SalesModel");
const { client, prisma } = require("../../../config/db");

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
      // const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // const totalSales = (
      //   await Sales.aggregate([
      //     { $match: { contractAddress: lowerCasedAddress } },
      //     { $match: { "sales.timestamp": { $gte: sevenDaysAgo } } },
      //     { $unwind: "$sales" },
      //     { $sort: { "sales.timestamp": -1 } },
      //     { $group: { _id: "$contractAddress", sales: { $push: "$sales" } } },
      //     { $project: { _id: 0, sales: { $slice: ["$sales", 2000] } } },
      //   ])
      // )[0].sales;

      const totalSales = // await client.query(
        //   `SELECT * FROM sales WHERE contract_address = '${lowerCasedAddress}' AND timestamp > ${sevenDaysAgo} ORDER BY timestamp DESC LIMIT 2000`
        // )
        (
          await prisma.$queryRaw`SELECT * FROM sale WHERE contract_address = ${lowerCasedAddress} ORDER BY timestamp DESC LIMIT 1000`
        )?.map(sale => {
          return {
            ...sale,
            tokenAddress: sale.contract_address,
            transactionHash: sale.transaction_hash,
            tokenId: sale.token_id,
            timestamp: new Date(sale.timestamp).getTime(),
          };
        });

      res.status(200).json({ totalSales, status: "success", ok: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getSales();
});

module.exports = collectionSalesRoute;
