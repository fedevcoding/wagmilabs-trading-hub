import React from "react";

import "./style.scss";
import { MoreInfo } from "../MoreInfo";

export const ImageCol = React.memo(({ details, address }) => {
  return (
    <div className="image-col">
      <img
        className="item-image"
        src={details.token.image}
        alt={details.token.name}
      />
      <div className="info">
        <div className="description">
          <span className="title">Description: </span>
          {details.token.description}
        </div>
        <MoreInfo details={details} address={address} />
      </div>
    </div>
  );
});
