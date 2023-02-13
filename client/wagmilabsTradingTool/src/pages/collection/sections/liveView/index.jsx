import React, { memo } from "react";
import { PageWrapper } from "@Components";
import { useGetData } from "./useGetData";
import "./index.scss";
import Column from "./components/Column";
import SalesMapping from "./mappings/SalesMapping";
import ListingMapping from "./mappings/ListingsMapping";
import BubbleChart from "./components/BubbleChart";

const LiveView = memo(({ address }) => {
  const { sales, listings, totalListings, totalSales } = useGetData(address);

  return (
    <PageWrapper page="collection-live-view">
      <div className="live-view-section">
        <Column type="listings">
          <ListingMapping listings={listings} contractAddress={address} />
        </Column>

        <Column type="sales">
          <SalesMapping sales={sales} />
        </Column>
      </div>

      <div>
        <BubbleChart totalListings={totalListings} totalSales={totalSales} />
      </div>
    </PageWrapper>
  );
});

export default LiveView;
