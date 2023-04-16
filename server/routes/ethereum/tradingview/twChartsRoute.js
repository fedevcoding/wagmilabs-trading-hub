const express = require("express");
const checkTradingviewAuth = require("../../../middleware/tradingviewCheckAuth");
require("dotenv").config();

const twChartRoute = express();

const database = {
  // address: [
  //   {
  //     name: "Chart 1",
  //     id: "0x0",
  //   },
  //   {
  //     name: "Chart 2",
  //     id: "0x01",
  //   },
  // ]
};

twChartRoute.post("/:collectionAddress/charts", checkTradingviewAuth, (req, res) => {
  const { address } = req.userDetails;

  const { name, content, resolution } = req.body;
  const contractAddress = JSON.parse(content).symbol;
  const symbol = JSON.parse(content).symbol_type;

  const data = {
    name,
    content,
    resolution,
    symbol,
    id: contractAddress,
    timestamp: Date.now() / 1000,
  };

  if (!database[address.toLowerCase()]) {
    database[address.toLowerCase()] = [data];
  } else {
    const filteredData = database[address.toLowerCase()]?.filter(chart => chart.id !== contractAddress) || [];

    database[address.toLowerCase()] = [...filteredData, data];
  }

  res.json({ status: "ok", id: contractAddress });
});

twChartRoute.get("/:collectionAddress/charts", checkTradingviewAuth, (req, res) => {
  const { address } = req.userDetails;

  const { chart } = req.query;
  const { collectionAddress } = req.params;

  if (chart) {
    const chartData = database[address.toLowerCase()]?.find(userchart => userchart.id === chart);
    const response = {
      status: "ok",
      data: {
        ...chartData,
      },
    };

    res.json(response);
  } else {
    const charts = database[address.toLowerCase()]?.filter(chart => chart.id === collectionAddress) || [];

    const response = {
      status: "ok",
      data: charts,
    };

    res.json(response);
  }
});

twChartRoute.delete("/:collectionAddress/charts", checkTradingviewAuth, (req, res) => {
  const { address } = req.userDetails;
  const { chart } = req.query;

  const filteredData = database[address.toLowerCase()]?.filter(userchart => userchart.id !== chart) || [];

  database[address.toLowerCase()] = filteredData;

  res.json({ status: "ok" });
});

module.exports = twChartRoute;
