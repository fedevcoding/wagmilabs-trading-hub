import moment from "moment";
import React from "react";
import { useAccount } from "wagmi";

import "./style.css";

export const PriceBox = React.memo(({ details }) => {
  const { address: accountAddress } = useAccount();
  const isOwner = details ? accountAddress === details?.token?.owner : false;

  const market = Object.values(details.market)[0];

  console.log(market);

  return (
    <>
      {(!isOwner && (
        <>
          {(market?.validUntil && (
            <p className="valid-until">
              <i className="fa fa-clock" />
              {"Sale ends "}
              {moment(market.validUntil * 1000).format("MMM DD, YYYY HH:mm")}
            </p>
          )) ||
            ""}
          {(market?.validUntil && (
            <div className="price-box">
              <p className="current-price">Current price</p>
              <div className="price">
                0,004 ETH
                <small>$6,69</small>
              </div>
            </div>
          )) ||
            ""}
        </>
      )) ||
        ""}
    </>
  );
});
