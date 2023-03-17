const express = require("express");

const floorChartRoute = express();

floorChartRoute.get("/floorPrice", async (req, res) => {
  try {
    const { collectionAddress, range } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const slugRes = await fetch(`https://api.coin-stats.com/v1/search?query=${collectionAddress}`);
    const slugData = await slugRes.json();
    const slug = slugData?.[1]?.data?.[0]?.id;

    if (!slug) throw new Error("Collection not found");

    const response = await fetch(`https://api.coin-stats.com/v2/nft/stats/chart/floor/${slug}?range=${range}`);
    const { data } = (await response.json()) || {};

    if (!data) throw new Error("No data found");

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = floorChartRoute;
