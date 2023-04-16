/* eslint-disable */
import { getFromServer } from "../../../../../../../../utils/functions/serverCalls";

const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ["1", "60", "120", "D", "W", "M"],
  supports_group_request: true,
  supports_marks: false,
  supports_search: false,
  supports_timescale_marks: true,
  darkMode: true,
};

export default {
  onReady: callback => {
    setTimeout(() => callback(configurationData));
  },
  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
    const data = symbolName.split(":");

    const ticker = data[0];
    const name = data[1];

    const symbolInfo = {
      ticker,
      //   name: "symbolItem.symbol",
      description: name,
      type: "NFT",
      session: "24x7",
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_no_volume: false,
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
    };

    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { to, firstDataRequest, from } = periodParams;

    const collectionAddress = symbolInfo.ticker;
    const data = await getFromServer(
      `/collectionCharts/floorPriceTW?collectionAddress=${collectionAddress}&resolution=${resolution}&from=${
        from * 1000
      }&to=${to * 1000}`
    );
    // const from = to - 1000 * 60 * 60 * 24 * 30 ** 2;

    let bars = [];
    data.forEach(bar => {
      const date = new Date(bar.time).getTime();
      if (date / 1000 >= from && date / 1000 < to) {
        bars = [
          ...bars,
          {
            time: date,
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close,
            volume: bar.volume,
          },
        ];
      }
    });
    if (firstDataRequest) {
      lastBarsCache.set(symbolInfo.full_name, {
        ...bars[bars.length - 1],
      });
    }

    if (bars.length === 0) {
      onHistoryCallback([], { noData: true });
    } else {
      onHistoryCallback(bars, {
        noData: false,
      });
    }
  },
  subscribeBars: () => {},
  unsubscribeBars: () => {},
};
