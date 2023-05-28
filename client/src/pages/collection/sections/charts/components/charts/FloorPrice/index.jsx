import React from "react";
// import { AdvancedFloorChart } from "./advanced";
// import { NormalFloorChart } from "./normal";
// import { useChartType } from "./useChartType";
import TradingviewFloor from "./tradingview";

export const FloorChart = ({ collectionAddress, floorPrice, collectionName }) => {
  // const { chartType, handleChartType } = useChartType();

  return (
    <>
      {/* {chartType === "normal" ? (
        <NormalFloorChart collectionAddress={collectionAddress} handleChartType={handleChartType} />
      ) : (
        <AdvancedFloorChart
          collectionAddress={collectionAddress}
          handleChartType={handleChartType}
          floorPrice={floorPrice}
        />
      )} */}
      <TradingviewFloor collectionAddress={collectionAddress} collectionName={collectionName} />
    </>
  );
};
