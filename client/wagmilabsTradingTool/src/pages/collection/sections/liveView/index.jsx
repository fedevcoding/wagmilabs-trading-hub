import React, { memo, useState } from "react";
import { PageWrapper } from "@Components";
import { useGetData } from "./useGetData";
import "./index.scss";
import Column from "./components/Column";
import SalesMapping from "./mappings/SalesMapping";
import ListingMapping from "./mappings/ListingsMapping";
import BubbleChart from "./components/BubbleChart";
import ListingChart from "./components/ListingChart";
import ComparisonChart from "./components/ComparisonChart";

const LiveView = memo(({ address, floorPrice, collectionImage }) => {
  const [columnHovered, setColumnHovered] = useState({
    listings: false,
    sales: false,
  });

  const { isLoading, sales, listings, totalListings, totalSales, tokens } = useGetData(
    address,
    columnHovered,
    floorPrice
  );

  const changeHover = (type, hovered) => {
    setColumnHovered(prev => ({ ...prev, [type]: hovered }));
  };

  return (
    <PageWrapper page="collection-live-view">
      <div className="live-view-section">
        <Column type="listings" columnHovered={columnHovered} changeHover={changeHover}>
          <ListingMapping
            listings={listings}
            contractAddress={address}
            collectionImage={collectionImage}
            isLoading={isLoading}
          />
        </Column>

        <Column type="sales" columnHovered={columnHovered} changeHover={changeHover}>
          <SalesMapping sales={sales} address={address} collectionImage={collectionImage} isLoading={isLoading} />
        </Column>

        <div className="charts-column">
          <ListingChart floorPrice={floorPrice} tokensData={tokens} />
          <ComparisonChart
            totalListings={totalListings}
            totalSales={totalSales}
            floorPrice={floorPrice}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div>
        {!isLoading && <BubbleChart totalListings={totalListings} totalSales={totalSales} floorPrice={floorPrice} />}
      </div>
    </PageWrapper>
  );
});

export default LiveView;
