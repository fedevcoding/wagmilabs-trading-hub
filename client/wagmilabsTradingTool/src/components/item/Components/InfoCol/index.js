import React from "react";
import { useNavigate } from "react-router-dom";
import { PriceBox } from "..";

import "./style.css";

export const InfoCol = React.memo(({ details, address }) => {
  const navigate = useNavigate();

  return (
    <div className="item-name-container">
      <h1 className="item-name">{details.token.name}</h1>
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

      <PriceBox details={details} />
    </div>
  );
});
