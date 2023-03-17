const express = require("express");

const advancedFloorChartRoute = express();

advancedFloorChartRoute.get("/advancedFloorPrice", async (req, res) => {
  try {
    const { collectionAddress } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const response = await fetch(
      `https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/${collectionAddress}/prices/DURATION_7_DAYS/GROUP_BY_PERIOD_1_DAY`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "1DeMDRFwiZu2QBfiRjRiFSeQuk8lZ9sSPEFxKbmgAnEWEdOK",
        },
      }
    );
    const { dataPoints } = (await response.json()) || {};

    console.log(dataPoints);

    if (!dataPoints) throw new Error("No data found");

    res.status(200).json(dataPoints);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = advancedFloorChartRoute;
