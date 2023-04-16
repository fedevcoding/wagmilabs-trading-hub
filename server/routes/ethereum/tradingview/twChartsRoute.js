const express = require("express");
const checkTradingviewAuth = require("../../../middleware/tradingviewCheckAuth");
const { client } = require("../../../config/db");
require("dotenv").config();

const twChartRoute = express();

twChartRoute.post("/:collectionAddress/charts", checkTradingviewAuth, async (req, res) => {
  try {
    const { address } = req.userDetails;

    const { name, content, resolution } = req.body;
    const contractAddress = JSON.parse(content).symbol;
    const symbol = JSON.parse(content).symbol_type;
    const timestamp = Math.round(Date.now() / 1000);

    await client.query(
      `WITH deleted_chart AS (
        DELETE FROM chart_layouts WHERE id = '${contractAddress}' AND address = '${address}'
        RETURNING *
      )
      INSERT INTO chart_layouts (address, name, content, resolution, symbol, id, timestamp)
      VALUES ('${address}', '${name}', '${content}', '${resolution}', '${symbol}', '${contractAddress}', '${timestamp}')
      RETURNING *
      `
    );

    res.json({ status: "ok", id: contractAddress });
  } catch (error) {
    res.status(400).json({ status: "error" });
  }
});

twChartRoute.get("/:collectionAddress/charts", checkTradingviewAuth, async (req, res) => {
  try {
    const { address } = req.userDetails;

    const { chart } = req.query;
    const { collectionAddress } = req.params;

    const { rows: charts } = await client.query(
      `SELECT * FROM chart_layouts WHERE address = '${address}' AND id = '${collectionAddress}'`
    );

    charts.forEach(chart => {
      chart.content = JSON.stringify(chart.content);
    });

    if (chart) {
      const response = {
        status: "ok",
        data: charts[0],
      };

      res.json(response);
    } else {
      const response = {
        status: "ok",
        data: charts,
      };

      res.json(response);
    }
  } catch (error) {
    res.status(400).json({ status: "error" });
  }
});

twChartRoute.delete("/:collectionAddress/charts", checkTradingviewAuth, async (req, res) => {
  try {
    const { address } = req.userDetails;
    const { chart } = req.query;

    await client.query(`DELETE FROM chart_layouts WHERE id = '${chart}' AND address = '${address}'`);

    res.json({ status: "ok" });
  } catch (error) {
    res.status(400).json({ status: "error" });
  }
});

module.exports = twChartRoute;
