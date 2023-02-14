import React from "react";
import notFound from "@Assets/notFound.svg";
import { MoreInfo } from "../MoreInfo";

import "./style.scss";

export const ImageCol = React.memo(({ details, address }) => {
  return (
    <div className="image-col">
      <img
        className="item-image"
        src={details.token?.image || notFound}
        alt={details.token.name}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = notFound;
        }}
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
