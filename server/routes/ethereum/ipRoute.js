const express = require("express");
require("dotenv").config();

const ipRoute = express();

ipRoute.get("/", async (req, res) => {
  try {
    const ip = req.clientIp;

    res.json(ip);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      authenticated: false,
      message: "Something went wrong",
    });
  }
});
module.exports = ipRoute;
