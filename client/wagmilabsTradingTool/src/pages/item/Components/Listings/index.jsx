import React from "react";
import { LoadingSpinner } from "@Components";
import { useListings } from "@reservoir0x/reservoir-kit-ui";
import { ListingTable } from "./ListingTable";

import "./style.scss";

export const Listings = React.memo(({ address, id, details }) => {
  const { data: listings } = useListings({
    token: [`${address}:${id}`],
    sortBy: "price",
    limit: 20,
  });

  return (
    <div id="item-listings">
      {((listings || []).length && (
        <>
          <div className="space-between item-listing-title">
            <h2>Listings</h2>
          </div>
          <div className="listing-table-container">
            <ListingTable
              listings={listings}
              address={address}
              details={details}
            />
          </div>
        </>
      )) || <LoadingSpinner />}
    </div>
  );
});
