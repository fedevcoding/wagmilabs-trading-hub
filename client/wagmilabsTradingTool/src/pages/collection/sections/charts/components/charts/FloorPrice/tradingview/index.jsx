import React, { useEffect, useRef } from "react";
// import { getFromServer } from "../../../../../../../utils/functions/serverCalls";
// import { createChart } from "lightweight-charts";
import datafeed from "./datafeed";

import { widget } from "../../../../../../../../charting_library";

const TradingviewFloor = ({ collectionAddress, collectionName }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const tvWidget = new widget({
      symbol: JSON.stringify({
        ticker: collectionAddress,
        name: collectionName,
      }), // default symbol
      datafeed: datafeed,
      interval: "H", // default interval
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      fullscreen: false,
      autosize: false,
      disabled_features: [
        "header_symbol_search",
        "compare_symbol_search_spread_operators",
        "header_compare",
        "object_tree_legend_mode",
        "hide_object_tree_and_price_scale_exchange_label",
        "show_object_tree",
        "timeframes_toolbar",
        "hide_object_tree_and_price_scale_exchange_label",
        "symbol_info_price_source",
        "symbol_info_long_description",
        "symbol_info",
      ],
      theme: "Dark",
      enabled_features: ["header_saveload"],
      timezone: "Europe/Rome",
    });

    return () => {
      tvWidget.remove();
    };

    // eslint-disable-next-line
  }, [collectionAddress]);

  return (
    <>
      <div ref={chartContainerRef} className={"tradingview-floor"} />
    </>
  );
};

export default TradingviewFloor;
