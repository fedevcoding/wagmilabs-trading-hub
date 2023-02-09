import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  BestOfferBox,
  BestOfferTable,
  ItemActivity,
  ListItem,
  PriceBox,
} from "..";

import "./style.css";

export const InfoCol = React.memo(({ details, address, id }) => {
  const navigate = useNavigate();
  const { address: accountAddress } = useAccount();
  const isOwner = details ? accountAddress === details?.token?.owner : false;
  const collectionImage = details.token?.collection?.image;

  return (
    <div className="item-name-container">
      <h1 className="item-name">{details.token.name}</h1>
      <div>
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
        <ListItem details={details} address={address} id={id} />
      ) : (
        <PriceBox details={details} address={address} />
      )}

      <BestOfferBox details={details} address={address} isOwner={isOwner} />
      <BestOfferTable details={details} />

      <ItemActivity
        address={address}
        id={id}
        currency={
          Object.values(details.market)[0]?.price?.currency?.symbol || "ETH"
        }
      />
    </div>
  );
});
