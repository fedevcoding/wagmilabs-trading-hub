const express = require("express");

const volumeChartRoute = express();

volumeChartRoute.get("/owners", async (req, res) => {
  try {
    const { collectionSlug, start } = req.query;

    if (!collectionSlug) throw new Error("Collection address is required");

    const response = await fetch(
      `https://api.nftinit.io/api/chart/?password=Gunah4423_&slug=${collectionSlug}&type=blue_chip_rate&field_type=2&start=${start}`
    );
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = volumeChartRoute;
