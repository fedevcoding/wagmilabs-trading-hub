import React from "react";
import { LoadingSpinner } from "@Components";
import { useListings } from "@reservoir0x/reservoir-kit-ui";
import { ListingTable } from "./ListingTable";

import "./style.scss";

export const Listings = React.memo(({ address, id, details }) => {
  const { data: listings, isFetchingPage } = useListings({
    token: [`${address}:${id}`],
    sortBy: "price",
    limit: 20,
  });

  return (
    <div id="item-listings">
      <div className="space-between item-listing-title">
        <h2>Listings</h2>
      </div>
      <div className="listing-table-container">
        {isFetchingPage ? (
          <div id="item-listings">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {((listings || []).length && (
              <ListingTable
                listings={listings}
                address={address}
                details={details}
              />
            )) ||
              "No listings found!"}
          </>
        )}
      </div>
    </div>
  );
});
