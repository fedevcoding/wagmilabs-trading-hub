import React from "react";
import { LoadingSpinner } from "@Components";
import { ListingTable } from "./ListingTable";
import { notFound } from "@Assets";
import { MakeOffer } from "..";

import "./style.scss";

export const Listings = React.memo(
  ({ address, details, listings, isFetching, isErc721, ownerBestListing, currency }) => {
    const market = Object.values(details.market)[0];
    const marketplace = market?.source?.name || "";

    return (
      <div id="item-listings">
        <div className="space-between item-listing-title actions">
          <h2>Listings</h2>
          {(!isErc721 && ownerBestListing && (
            <MakeOffer
              address={address}
              tokenId={details?.token?.tokenId || ""}
              marketplace={marketplace}
              details={details}
              currency={currency}
            />
          )) ||
            ""}
        </div>
        <div className="listing-table-container">
          {isFetching ? (
            <div id="item-listings">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {((listings || []).length && (
                <ListingTable listings={listings} address={address} details={details} />
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
