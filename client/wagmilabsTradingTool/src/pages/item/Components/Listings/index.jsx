import React from "react";
import { LoadingSpinner } from "@Components";
import { ListingTable } from "./ListingTable";

import "./style.scss";

export const Listings = React.memo(
  ({ address, details, listings, isFetching }) => {
    return (
      <div id="item-listings">
        <div className="space-between item-listing-title">
          <h2>Listings</h2>
        </div>
        <div className="listing-table-container">
          {isFetching ? (
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
  }
);
