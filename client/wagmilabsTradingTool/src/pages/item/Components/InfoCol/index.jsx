import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BestOfferBox,
  BestOfferTable,
  Listings,
  ListItem,
  PriceBox,
  TransferItem,
} from "..";

import "./style.scss";
import { useGetData } from "./useGetData";

export const InfoCol = React.memo(({ details, address, id }) => {
  const navigate = useNavigate();
  const {
    collectionImage,
    currency,
    isOwner,
    listings,
    isFetchingListings,
    isErc721,
  } = useGetData(details, address, id);

  return (
    <div className="item-name-container">
      <div className="space-between">
        <div>
          <h1 className="item-name">{details.token.name}</h1>
          <div
            className="item-collection-info"
            onClick={() => navigate(`/collection/${address}`)}
          >
            {(collectionImage && (
              <img
                className="item-collection-image"
                src={details.token.collection.image}
                alt={details.token.collection.name}
              />
            )) ||
              ""}
            <div className="item-collection-name">
              {details.token.collection.name}
            </div>
          </div>
        </div>
        {isOwner ? (
          <div className="owner-buttons">
            <TransferItem
              details={details}
              address={address}
              id={id}
              currency={currency}
            />
            <ListItem
              details={details}
              address={address}
              id={id}
              currency={currency}
              lastListing={listings.length ? listings[0] : null}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      {!isOwner || isErc721 ? (
        <PriceBox details={details} address={address} currency={currency} />
      ) : (
        ""
      )}

      <BestOfferBox
        details={details}
        address={address}
        isOwner={isOwner}
        currency={currency}
      />
      <Listings
        details={details}
        address={address}
        listings={listings}
        isFetching={isFetchingListings}
      />
      <BestOfferTable details={details} isErc721={isErc721} />
    </div>
  );
});
