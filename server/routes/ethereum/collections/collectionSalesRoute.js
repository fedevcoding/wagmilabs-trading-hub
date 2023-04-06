const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const SalesTest = require("../../../models/SalesTest");
const Sales = require("../../../models/SalesModel");
const { client } = require("../../../config/db");
const { snakeToCamel } = require("../../../utils/utils");

const collectionSalesRoute = express();

collectionSalesRoute.get("/:address", checkAuth, (req, res) => {
  async function getSales() {
    try {
      const { address } = req.params;

      if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" });

      const lowerCasedAddress = address.toLowerCase();

      console.time("start");
      // const totalSales =
      // (await Sales.findOne({ contractAddress: lowerCasedAddress }, { sales: { $slice: -2000 } }))?.sales || [];
      // const totalSales = await SalesTest.find({ contractAddress: lowerCasedAddress });
      const totalSales = (
        await client.query(
          `SELECT * FROM sales WHERE contract_address = '${lowerCasedAddress}' ORDER BY timestamp DESC`
        )
      ).rows;

      console.timeEnd("start");
      // console.log(totalSales);
      res.status(200).json({ totalSales: [], status: "success", ok: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
  getSales();
});

module.exports = collectionSalesRoute;
