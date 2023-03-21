import React from "react";
import { AvgPriceChart, BuyersSellersChart, FloorChart, ListingChart, OwnersChart, SalesChart, VolumeChart } from "../";

export const CollectionCharts = ({ activeChart, charts, collectionAddress, collectionSlug, floorPrice }) => {
  return (
    <div className="charts">
      {(() => {
        switch (activeChart.value) {
          case charts[0].value:
            return <FloorChart collectionAddress={collectionAddress} floorPrice={floorPrice} />;
          case charts[1].value:
            return <BuyersSellersChart collectionAddress={collectionAddress} />;
          case charts[2].value:
            return <ListingChart collectionAddress={collectionAddress} />;
          case charts[3].value:
            return <OwnersChart collectionSlug={collectionSlug} />;
          case charts[4].value:
            return <VolumeChart collectionAddress={collectionAddress} />;
          case charts[5].value:
            return <SalesChart collectionAddress={collectionAddress} />;
          case charts[6].value:
            return <AvgPriceChart collectionAddress={collectionAddress} />;
          default:
            return "inexistent chart";
        }
      })()}
    </div>
  );
};
