import { Tooltip } from "@chakra-ui/react";
import { Button } from "@Components";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BestOfferBox, BestOfferTable, Listings, ListItem, PriceBox, TransferItem } from "..";
import { useRefreshToken } from "../ImageCol/useRefreshToken";

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
    ownerBestListing,
    ownershipTokenCount,
    totalSupply,
  } = useGetData(details, address, id);

  const { refreshToken } = useRefreshToken(address, id);

  return (
    <div className="item-name-container">
      <div className="space-between">
        <div>
          <h1 className="item-name">{details.token.name}</h1>
          <div className="item-collection-info" onClick={() => navigate(`/collection/${address}`)}>
            {(collectionImage && (
              <img
                className="item-collection-image"
                src={details.token.collection.image}
                alt={details.token.collection.name}
              />
            )) ||
              ""}
            <div className="item-collection-name">{details.token.collection.name}</div>
          </div>
          {(!isErc721 && totalSupply && (
            <div>
              {"Total Supply: "}
              {totalSupply.toLocaleString("EN-us")}
            </div>
          )) ||
            ""}
          {(!isErc721 && ownershipTokenCount && (
            <div>
              {"Ownership Token Count: "}
              {ownershipTokenCount}
            </div>
          )) ||
            ""}
        </div>
        <div className="top-right-buttons">
          <Tooltip
            closeOnClick={false}
            hasArrow
            label={"Refresh metadata"}
            fontSize="s"
            bg="black"
            color={"white"}
            placement="top"
            borderRadius={"7px"}
          >
            <div>
              <Button className="refresh-btn" onClick={() => refreshToken()}>
                <i className="fa-solid fa-refresh" />
              </Button>
            </div>
          </Tooltip>
          {isOwner ? (
            <div className="owner-buttons">
              <TransferItem details={details} address={address} id={id} currency={currency} />
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
      </div>

      <PriceBox
        details={details}
        address={address}
        currency={currency}
        ownerBestListing={ownerBestListing}
        isErc721={isErc721}
      />

      <BestOfferBox details={details} address={address} isOwner={isOwner} currency={currency} isErc721={isErc721} />
      <Listings
        details={details}
        address={address}
        currency={currency}
        listings={listings}
        isErc721={isErc721}
        isFetching={isFetchingListings}
        ownerBestListing={ownerBestListing}
      />
      <BestOfferTable details={details} isErc721={isErc721} />
    </div>
  );
});
