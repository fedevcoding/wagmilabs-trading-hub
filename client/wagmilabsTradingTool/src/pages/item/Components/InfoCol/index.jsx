import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  BestOfferBox,
  BestOfferTable,
  ItemActivity,
  Listings,
  ListItem,
  PriceBox,
  TransferItem,
} from "..";

import "./style.scss";

export const InfoCol = React.memo(({ details, address, id }) => {
  const navigate = useNavigate();
  const { address: accountAddress } = useAccount();
  const isOwner = details
    ? accountAddress?.toLowerCase() === details?.token?.owner?.toLowerCase()
    : false;
  const collectionImage = details.token?.collection?.image;

  const currency =
    Object.values(details.market)[0]?.price?.currency?.symbol || "ETH";

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
            />
          </div>
        ) : (
          ""
        )}
      </div>

      {isOwner ? "" : <PriceBox details={details} address={address} />}

      {details?.token?.kind === "erc1155" ? (
        <Listings details={details} address={address} id={id} />
      ) : (
        ""
      )}

      <BestOfferBox details={details} address={address} isOwner={isOwner} />
      <BestOfferTable details={details} />

      <ItemActivity address={address} id={id} currency={currency} />
    </div>
  );
});
