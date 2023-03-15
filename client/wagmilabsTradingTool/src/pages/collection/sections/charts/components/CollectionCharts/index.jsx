import React from "react";
import { FloorChart, ListingChart, OwnersChart, VolumeChart } from "../";

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
          case charts[3].value:
            return <VolumeChart collectionAddress={collectionAddress} />;
          default:
            return "inexistent chart";
        }
      })()}
    </div>
  );
};
