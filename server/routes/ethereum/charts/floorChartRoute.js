const express = require("express");

const floorChartRoute = express();

floorChartRoute.get("/floorPrice", async (req, res) => {
  try {
    const { collectionAddress, startDate } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": "JXDZIGSCK3UZO5CW5XSTTV2FS36S8RR1",
      },
      body: JSON.stringify({
        collection_address: collectionAddress,
        floor_only: false,
        frequency: "1D",
        report_start_date: startDate,
      }),
    };
    const response = await fetch(`https://api.prod.gallop.run/v1/analytics/eth/getCollectionListingsOHLC`, options);
    const data = (await response.json()).response;

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = floorChartRoute;
