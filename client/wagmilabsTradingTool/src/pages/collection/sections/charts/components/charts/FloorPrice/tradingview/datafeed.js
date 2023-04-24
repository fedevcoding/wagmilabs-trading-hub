/* eslint-disable */
import { useContext } from "react";
import { SocketContext } from "../../../../../../../../context/SocketContext";
import { getFromServer } from "../../../../../../../../utils/functions/serverCalls";

const lastBarsCache = new Map();
const configurationData = {
  supported_resolutions: ["1", "5", "15", "30", "60", "120", "360", "D", "W", "M"],
  // supports_group_request: true,
  // supports_marks: true,
  // supports_search: false,
  // supports_timescale_marks: true,
  // darkMode: true,
  exchanges: ["opensea", "x2y2", "blur"],
  supports_time: true,
};
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

let symbol_name = "";
let updateIntervals = [];

export const useDatafeed = () => {
  const socket = useContext(SocketContext);

  return {
    setSymbolName: name => {
      symbol_name = name;
    },
    onReady: callback => {
      setTimeout(() => callback(configurationData));
    },
    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
      const symbolInfo = {
        ticker: symbolName,
        name: "",
        description: symbol_name,
        type: symbol_name,
        session: "24x7",
        minmov: 1,
        pricescale: 10000,
        has_intraday: true,
        has_no_volume: false,
        has_weekly_and_monthly: true,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        has_seconds: true,
      };

      onSymbolResolvedCallback(symbolInfo);
    },
    // getServerTime: callback => {
    //   console.log("Countdown time: " + Math.floor(new Date().getTime() / 1000));
    //   callback(Math.floor(new Date().getTime() / 1000));
    // },
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
      try {
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
      } catch (err) {
        // console.log(err);
        onErrorCallback();
      }
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
      const resolutionInMinutes = chartResolutions[resolution];
      const newInterval = setInterval(() => {
        const lastBar = lastBarsCache.get(symbolInfo.full_name);
        const { close } = lastBar;
        const time = Date.now();
        const bar = { time, close, open: close, high: close, low: close };
        lastBarsCache.set(symbolInfo.full_name, bar);
        onRealtimeCallback(bar);
      }, resolutionInMinutes * 60 * 1000);

      updateIntervals.push(newInterval);

      socket.emit("joinFloorChanges", symbolInfo.ticker.toLowerCase());
      socket.on("floor_change", data => {
        const { floorPrice } = data;

        const { time, open, high, low, volume } = lastBarsCache.get(symbolInfo.full_name);
        const bar = {
          time,
          close: floorPrice,
          open,
          high: floorPrice >= high ? floorPrice : high,
          low: floorPrice <= low ? floorPrice : low,
          volume,
        };
        lastBarsCache.set(symbolInfo.full_name, bar);
        onRealtimeCallback(bar);
      });
    },
    unsubscribeBars: listenerGuid => {
      const contractAddress = listenerGuid?.split("-")[0];

      clearInterval(updateIntervals[0]);
      socket.emit("leaveFloorChanges", contractAddress.toLowerCase());
    },
  };
};
