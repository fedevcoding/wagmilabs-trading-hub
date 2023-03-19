import React from "react";
import { AdvancedFloorChart } from "./advanced";
import { NormalFloorChart } from "./normal";
import { useChartType } from "./useChartType";

export const FloorChart = ({ collectionAddress, floorPrice }) => {
  const { chartType, handleChartType } = useChartType();

  return (
    <>
      {chartType === "normal" ? (
        <NormalFloorChart collectionAddress={collectionAddress} handleChartType={handleChartType} />
      ) : (
        <AdvancedFloorChart
          collectionAddress={collectionAddress}
          handleChartType={handleChartType}
          floorPrice={floorPrice}
        />
      )}
    </>
  );
};
