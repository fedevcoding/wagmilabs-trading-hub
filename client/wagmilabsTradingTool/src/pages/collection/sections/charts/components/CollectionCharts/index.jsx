import React from "react";
import { FloorChart, ListingChart } from "../";

export const CollectionCharts = ({ activeChart, charts, collectionAddress }) => {
  return (
    <div className="charts">
      {(() => {
        switch (activeChart.value) {
          case charts[0].value:
            return <FloorChart collectionAddress={collectionAddress} />;
          case charts[1].value:
            return <ListingChart collectionAddress={collectionAddress} />;
          default:
            return "inexistent chart";
        }
      })()}
    </div>
  );
};
