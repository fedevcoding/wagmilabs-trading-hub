/* eslint-disable */
import { useContext } from "react";
import { SocketContext } from "../../../../../../../../context/SocketContext";
import { getFromServer } from "../../../../../../../../utils/functions/serverCalls";

const lastBarsCache = new Map();
const configurationData = {
  supported_resolutions: ["1", "5", "15", "30", "60", "120", "360", "D", "W", "M"],
  supports_group_request: true,
  supports_marks: false,
  supports_search: false,
  supports_timescale_marks: true,
  darkMode: true,
};

let symbol_name = "";

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
        pricescale: 1000,
        has_intraday: true,
        has_no_volume: false,
        has_weekly_and_monthly: true,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
      };

      onSymbolResolvedCallback(symbolInfo);
    },

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
      // socket.emit("joinFloorChanges", symbolInfo.ticker.toLowerCase());
      // socket.on("floor_change", data => {
      //   console.log(data);
      // });
      // const bar = { time: 1682235487000, close: 10, open: 0.05, high: 12, low: 0.03, volume: 10 };
      // setTimeout(() => {
      //   onRealtimeCallback(bar);
      // }, 5000);
    },
    unsubscribeBars: () => {},
  };
};
