import React from "react";
import { Col, Row } from "../../../utility-components";
import { MakeOffer } from "..";

export const BestOfferBox = React.memo(({ details, address, isOwner }) => {
  const market = Object.values(details.market)[0];
  const topBid = details?.market?.topBid;
  const tokenId = details?.token?.tokenId || "";
  const marketplace = market?.source?.name || "";

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
              <MakeOffer
                address={address}
                tokenId={tokenId}
                marketplace={marketplace}
              />
            </Col>
          </Row>
        </div>
      )) ||
        ""}
    </>
  );
});
