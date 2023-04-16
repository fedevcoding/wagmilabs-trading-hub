import React, { useEffect, useRef } from "react";
// import { getFromServer } from "../../../../../../../utils/functions/serverCalls";
// import { createChart } from "lightweight-charts";
import datafeed from "./datafeed";
import { widget } from "../../../../../../../../charting_library";

const TradingviewFloor = ({ collectionAddress, collectionName }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const tvWidget = new widget({
      symbol: collectionAddress,
      datafeed: datafeed,
      interval: "H",
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
      timezone,
      client_id: "wagmilabs.tools",
      user_id: localStorage.getItem("jsonwebtoken"),
      charts_storage_url: "tradingView",
      charts_storage_api_version: collectionAddress,
      load_last_chart: true,
      restConfig: {
        url: "https://api.wagmilabs.com",
        access_token: localStorage.jsonwebtoken,
      },
    });
    tvWidget._options.datafeed.setSymbolName(collectionName);

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
