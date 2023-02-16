import React, { memo, useState } from "react";
import { PageWrapper } from "@Components";
import { useGetData } from "./useGetData";
import "./index.scss";
import Column from "./components/Column";
import SalesMapping from "./mappings/SalesMapping";
import ListingMapping from "./mappings/ListingsMapping";
import BubbleChart from "./components/BubbleChart";

const LiveView = memo(({ address, floorPrice }) => {

  const [columnHovered, setColumnHovered] = useState({
    listings: false,
    sales: false,
  });

  const { sales, listings, totalListings, totalSales } = useGetData(address, columnHovered);


  const changeHover = (type, hovered) => {
    setColumnHovered((prev) => ({ ...prev, [type]: hovered }));
  }

  return (
    <PageWrapper page="collection-live-view">
      <div className="live-view-section">
        <Column type="listings" columnHovered={columnHovered} changeHover={changeHover}>
          <ListingMapping listings={listings} contractAddress={address}/>
        </Column>

        <Column type="sales" columnHovered={columnHovered} changeHover={changeHover}>
          <SalesMapping sales={sales} address={address}/>
        </Column>
      </div>

      <div>
        <BubbleChart totalListings={totalListings} totalSales={totalSales} floorPrice={floorPrice}/>
      </div>
    </PageWrapper>
  );
});

export default LiveView;
