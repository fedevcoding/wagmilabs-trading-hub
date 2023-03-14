import React from "react";
import { FloorChart, ListingChart } from "../";
import { OwnersChart } from "../charts/Owners";

export const CollectionCharts = ({ activeChart, charts, collectionAddress, collectionSlug }) => {
  return (
    <div className="charts">
      {(() => {
        switch (activeChart.value) {
          case charts[0].value:
            return <FloorChart collectionAddress={collectionAddress} />;
          case charts[1].value:
            return <ListingChart collectionAddress={collectionAddress} />;
          case charts[2].value:
            return <OwnersChart collectionSlug={collectionSlug} />;
          default:
            return "inexistent chart";
        }
      })()}
    </div>
  );
};
