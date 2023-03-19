const express = require("express");

const ownersChartRoute = express();

ownersChartRoute.get("/owners", async (req, res) => {
  try {
    const { collectionSlug, start } = req.query || {};

    if (!collectionSlug || !start) throw new Error("Collection address is required");

    const response = await fetch(
      `https://api.nftinit.io/api/chart/?password=Gunah4423_&slug=${collectionSlug}&type=blue_chip_rate&field_type=2&start=${start}`
    );
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = ownersChartRoute;
