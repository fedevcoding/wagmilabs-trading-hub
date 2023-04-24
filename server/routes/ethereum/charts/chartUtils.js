const chartResolutions = {
  // "1S": 0.01666666666
  1: 1,
  5: 5,
  15: 15,
  30: 30,
  60: 60,
  120: 120,
  360: 360,
  "1D": 60 * 24,
  "1W": 60 * 24 * 7,
  "1M": 60 * 24 * 30,
};

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

module.exports = {
  chartResolutions,
  fillFloorGaps,
  fillVolumeGaps,
};
