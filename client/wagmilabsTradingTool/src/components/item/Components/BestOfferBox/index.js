import React from "react";
import { useAccount } from "wagmi";
import { Col, Row } from "../../../utility-components";

export const BestOfferBox = React.memo(({ details }) => {
  const { address: accountAddress } = useAccount();
  const isOwner = details ? accountAddress === details?.token?.owner : false;
  const market = Object.values(details.market)[0];
  const topBid = details?.market?.topBid;

  return (
    <>
      {(!isOwner && !market.id && topBid && (
        <div className="price-box">
          <p className="current-price">Best offer</p>
          <div className="price">
            {topBid.price.amount.decimal} {topBid.price.currency.symbol}
            <small>
              $
              {topBid.price.amount.usd.toLocaleString("EN-us", {
                maximumFractionDigits: 2,
              })}
            </small>
          </div>
          <Row className="actions">
            <Col>
              <div className="btn">
                <i className="fa fa-tag" />
                Make offer
              </div>
            </Col>
          </Row>
        </div>
      )) ||
        ""}
    </>
  );
});
