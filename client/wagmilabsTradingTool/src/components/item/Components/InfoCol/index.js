import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

import "./style.css";

export const InfoCol = React.memo(({ details, address }) => {
  const navigate = useNavigate();
  const { address: accountAddress } = useAccount();
  const isOwner = details ? accountAddress === details?.token?.owner : false;

  console.log("isOwner", isOwner);

  return (
    <div className="item-name-container">
      <div className="item-star-container">
        <h1 className="item-name">{details.token.name}</h1>
      </div>

      <div
        className="item-collection-info"
        onClick={() => navigate(`/collection/${address}`)}
      >
        <img
          className="item-collection-image"
          src={details.token.collection.image}
          alt={details.token.collection.name}
        />
        <div className="item-collection-name">
          {details.token.collection.name}
        </div>
      </div>
    </div>
  );
});
