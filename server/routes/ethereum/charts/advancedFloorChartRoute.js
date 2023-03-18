const express = require("express");

const advancedFloorChartRoute = express();

advancedFloorChartRoute.get("/advancedFloorPrice", async (req, res) => {
  try {
    const { collectionAddress, range, granularity } = req.query;

    if (!collectionAddress || !range || !granularity) throw new Error("More data is required");

    const response = await fetch(
      `https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/${collectionAddress}/prices/DURATION_${range}/GROUP_BY_PERIOD_${granularity}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "1DeMDRFwiZu2QBfiRjRiFSeQuk8lZ9sSPEFxKbmgAnEWEdOK",
        },
      }
    );
    const { dataPoints } = (await response.json()) || {};
    if (!dataPoints) throw new Error("No data found");

    dataPoints?.forEach(item => {
      const { min, max, avg } = item;
      item["min"] = parseFloat(min) || 0;
      item["max"] = parseFloat(max) || 0;
      item["avg"] = parseFloat(avg) || 0;
    });

    const allZero = dataPoints.every(item => item.min === 0 && item.max === 0 && item.avg === 0);
    if (allZero) throw new Error("No data found");

    res.status(200).json(dataPoints);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = advancedFloorChartRoute;
