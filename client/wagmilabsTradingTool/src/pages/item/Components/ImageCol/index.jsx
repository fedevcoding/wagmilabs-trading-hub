import React from "react";
import { placeholderImage } from "@Assets";
import { MoreInfo } from "../MoreInfo";
import { Button } from "@Components";
import { useRefreshToken } from "./useRefreshToken";

import "./style.scss";

export const ImageCol = React.memo(({ details, address, id }) => {
  const { refreshToken } = useRefreshToken(address, id);

  return (
    <div className="image-col">
      <img
        className="item-image"
        src={details.token?.image || placeholderImage}
        alt={details.token.name}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = placeholderImage;
        }}
      />
      <div className="info">
        <div className="description">
          <div className="space-between">
            <span className="title">Description: </span>
            <Button className="refresh-btn" onClick={() => refreshToken()}>
              Refresh metadata
            </Button>
          </div>
          {details.token.description}
        </div>
        <MoreInfo details={details} address={address} />
      </div>
    </div>
  );
});
