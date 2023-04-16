const express = require("express");
const { client } = require("../../../config/db");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");

const floorChartRoute = express();

function fillFloorGaps(candlestickData, granularity) {
  // Calculate the number of milliseconds for the specified granularity
  const granularityMs = granularity * 60 * 1000;

  // fill candles from last candle to current time
  const lastCandle = candlestickData[candlestickData.length - 1];
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - lastCandle?.time;

  if (timeDiff > granularityMs) {
    const numMissingCandles = Math.floor(timeDiff / granularityMs);

    for (let i = 1; i <= numMissingCandles; i++) {
      const missingTime = lastCandle.time + i * granularityMs;
      const missingCandle = {
        time: missingTime,
        open: lastCandle.close,
        high: lastCandle.close,
        low: lastCandle.close,
        close: lastCandle.close,
        volume: 0,
      };

      candlestickData.push(missingCandle);
    }
  }

  // Iterate through the candlestick data and fill any gaps with the previous data
  for (let i = 1; i < candlestickData.length; i++) {
    const currentCandle = candlestickData[i];
    const previousCandle = candlestickData[i - 1];

    // Calculate the time difference between the current candle and the previous candle
    const timeDiff = currentCandle.time - previousCandle.time;

    // If there is a gap between the candles, fill it with the previous candle's data
    if (timeDiff > granularityMs) {
      const numMissingCandles = Math.floor(timeDiff / granularityMs) - 1;

      for (let j = 1; j <= numMissingCandles; j++) {
        const missingTime = previousCandle.time + j * granularityMs;
        const missingCandle = {
          time: missingTime,
          open: previousCandle.close,
          high: previousCandle.close,
          low: previousCandle.close,
          close: previousCandle.close,
        };

        candlestickData.splice(i, 0, missingCandle);
        i++;
      }
    }
  }

  return candlestickData;
}

function fillVolumeGaps(volumeData, granularity) {
  const granularityMs = granularity * 60 * 1000;

  // Iterate through the candlestick data and fill any gaps with the previous data
  for (let i = 1; i < volumeData.length; i++) {
    const currentVolume = volumeData[i];
    const previousVolume = volumeData[i - 1];

    // Calculate the time difference between the current candle and the previous candle
    const timeDiff = new Date(currentVolume.time).getTime() - new Date(previousVolume.time).getTime();

    // If there is a gap between the candles, fill it with the previous candle's data
    if (timeDiff > granularityMs) {
      const numMissingVolumes = Math.floor(timeDiff / granularityMs) - 1;

      for (let j = 1; j <= numMissingVolumes; j++) {
        volumeData.splice(i, 0, 0);
        i++;
      }
    }
  }

  return volumeData;
}

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
    res.status(500).json({ error: error.message });
  }
});

floorChartRoute.get("/floorPriceTW", async (req, res) => {
  try {
    const { collectionAddress, resolution, from, to } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const granularity =
      resolution === "1D"
        ? 60 * 24
        : resolution === "120"
        ? 60 * 2
        : resolution === "60"
        ? 60
        : resolution === "1"
        ? 1
        : (() => {
            throw new Error("Invalid resolution");
          })();

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
        AND timestamp <= ${to}
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

      const time = new Date(row.time).getTime();

      if (time < startDate) startDate = time;

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
