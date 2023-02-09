import React from "react";
import { formatContractAddress } from "../../../../utils/formats/formats";
import moment from "moment";
import { Attributes } from "..";

import "./style.css";

export const MoreInfo = React.memo(({ details, address }) => {
  const [visible, setVisible] = React.useState(
    details.token.attributes.length === 0
  );
  return (
    <div className="more-info">
      <div className="dropdown-btn" onClick={() => setVisible(!visible)}>
        Details
        <i className={`fa fa-angle-${visible ? "up" : "down"}`} />
      </div>
      <div className={`dropdown-content ${visible ? "visible" : ""}`}>
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
        <div>
          <span className="title">Owner: </span>
          {formatContractAddress(details.token.owner)}
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
      <Attributes attributes={details.token.attributes} />
    </div>
  );
});
