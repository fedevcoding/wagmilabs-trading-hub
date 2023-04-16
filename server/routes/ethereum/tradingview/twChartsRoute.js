const express = require("express");
require("dotenv").config();

const twChartRoute = express();

let savedcontent;

twChartRoute.post("/charts", (req, res) => {
  const data = req.body;

  //   console.log(data);
  const { name, content, symbol, resolution } = data;
  console.log(name, resolution);

  savedcontent = content;

  res.json({ status: "ok", id: 1 });
});

twChartRoute.get("/charts", (req, res) => {
  const { chart } = req.query;

  if (chartId) {
    const response = {
      status: "ok",
      data: {
        name: "test",
        content: savedcontent,
        id: 1,
        timestamp: 1681632814,
      },
    };

    res.json(response);
  } else {
    const response = {
      status: "ok",
      data: [
        {
          name: "test",
          // content: savedcontent,
          symbol: "test",
          id: 1,
          resolution: "H",
          timestamp: 1681632814,
        },
      ],
    };

    res.json(response);
  }
});

module.exports = twChartRoute;
