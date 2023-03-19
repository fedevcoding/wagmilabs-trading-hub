const express = require("express");

const listingChartRoute = express();

listingChartRoute.get("/listings", async (req, res) => {
  try {
    const { collectionAddress, range } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const response = await fetch(
      `https://api.nftbank.run/v1/collection/${collectionAddress}/market-status/listing/history?networkId=ethereum&interval=daily&window=${range}&limit=90`,
      {
        headers: { accept: "application/json", "x-api-key": "76359d065f1b7632727fc28715b8468f" },
      }
    );

    const { data } = (await response.json())?.data || {};

    const allZero = data.every(item => item.todayListed === 0 && item.totalListed === 0);
    if (allZero) throw new Error("No data found");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = listingChartRoute;
