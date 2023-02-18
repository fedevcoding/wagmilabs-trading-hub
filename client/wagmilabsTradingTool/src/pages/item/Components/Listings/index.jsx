import React from "react";
import { LoadingSpinner } from "@Components";
import { ListingTable } from "./ListingTable";
import { notFound } from "@Assets";

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
              )) || (
                <div className="text-center">
                  <img src={notFound} alt="best offer" width={100} />
                  <br />
                  <div>There are no listings for this asset</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);
