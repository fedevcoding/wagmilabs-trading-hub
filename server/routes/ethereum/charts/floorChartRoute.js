const express = require("express");
const { client } = require("../../../config/db");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");
const checkAuth = require("../../../middleware/checkAuth");
const { chartResolutions, fillFloorGaps, fillVolumeGaps } = require("./chartUtils");

const floorChartRoute = express();

floorChartRoute.get("/floorPrice", checkAuth, async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

floorChartRoute.get("/floorPriceTW", checkAuth, async (req, res) => {
  try {
    const { collectionAddress, resolution, from } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const granularity = chartResolutions[resolution];

    if (!granularity) throw new Error("Invalid resolution");

    const floorSql = `
      WITH daily_data AS (
        SELECT
          TIMESTAMP 'epoch' + INTERVAL '1 second' * (FLOOR(EXTRACT(epoch FROM to_timestamp(timestamp / 1000.0)) / (1 * ${granularity} * 60)) * (1 * ${granularity} * 60)) AS time,
          floor_price,
          ROW_NUMBER() OVER (PARTITION BY TIMESTAMP 'epoch' + INTERVAL '1 second' * (FLOOR(EXTRACT(epoch FROM to_timestamp(timestamp / 1000.0)) / (1 * ${granularity} * 60)) * (1 * ${granularity} * 60)) ORDER BY timestamp DESC) AS reverse_rank
        FROM
          floor_changes
        WHERE
          contract_address = '${collectionAddress}'
        AND timestamp >= ${from}
        ORDER BY timestamp
      )
      
      SELECT
        time,
        MIN(floor_price) FILTER (WHERE reverse_rank = 1) AS close,
        MAX(floor_price) AS high,
        MIN(floor_price) AS low
      FROM
        daily_data
      GROUP BY
        time
      ORDER BY
        time;
    `;

    const { rows: candleSticks } = await client.query(floorSql);

    let startDate = Date.now();
    const result = candleSticks.map((row, index) => {
      const prev = candleSticks?.[index - 1];

      // add 2 hours
      const time = new Date(row.time).getTime() + 2 * 60 * 60 * 1000;

      if (time < startDate) startDate = time;

      // if current low is 2000% higher than previous low, then remove it
      if (row.high > prev?.high * 20) row.high = prev?.high;

      return {
        time,
        open: prev?.close || row.close,
        close: row.close,
        high: row.high,
        low: row.low,
      };
    });
    const volumeSql = `
    WITH timestamp_volume AS (
      SELECT
      TIMESTAMP 'epoch' + INTERVAL '1 second' * (FLOOR(EXTRACT(epoch FROM timestamp) / (1 * ${granularity} * 60)) * 1 * ${granularity} * 60) AS time,
         SUM(eth_price) AS volume
      FROM
         ethereum.nft_sales
      WHERE
         contract_address = '${collectionAddress}'
      AND timestamp >= '${new Date(startDate).toISOString()}'
      GROUP BY
         time
   )
   SELECT
      time,
      volume
   FROM
      timestamp_volume
   ORDER BY
      time ASC;
    `;
    const volumeData = await execTranseposeAPI(volumeSql);

    const filledCandleSticks = fillFloorGaps(result, granularity);
    const filledVolume = fillVolumeGaps(volumeData, granularity);

    filledCandleSticks.forEach((candle, index) => {
      candle.volume = filledVolume?.[index]?.volume;
    });

    res.status(200).json(filledCandleSticks);
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: error.message });
    res.status(200).json([]);
  }
});

module.exports = floorChartRoute;
