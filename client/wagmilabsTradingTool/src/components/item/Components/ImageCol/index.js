import React from "react";
import { formatContractAddress } from "../../../../utils/formats/formats";
import moment from "moment";

import "./style.css";

export const ImageCol = React.memo(({ details, address }) => {
  return (
    <div className="image-col">
      <img
        className="item-image"
        src={details.token.image}
        alt={details.token.name}
      />
      <div className="info">
        <div>
          <span className="title">Description: </span>
          {details.token.description}
        </div>
        <div>
          <span className="title">Contract Address: </span>
          {formatContractAddress(address)}
        </div>
        <div>
          <span className="title">Token ID: </span>
          {details.token.tokenId}
        </div>
        <div>
          <span className="title">Token Standard: </span>
          {details.token.kind.toUpperCase()}
        </div>
        <div>
          <span className="title">Chain: </span>
          Ethereum
        </div>
        {(details?.token?.lastFlagUpdate && (
          <div>
            <span className="title">Last Update: </span>
            {`${moment(details.token.lastFlagUpdate)
              .utc()
              .format("MMM DD, YYYY HH:mm")} GMT`}
          </div>
        )) ||
          ""}
        {(details?.token?.rarity && (
          <div>
            <span className="title">Rarity: </span>
            {details.token.rarity}%
          </div>
        )) ||
          ""}
        {(details?.token?.rarityRank && (
          <div>
            <span className="title">Rarity Rank: </span>
            {details.token.rarityRank}
          </div>
        )) ||
          ""}
      </div>
    </div>
  );
});
