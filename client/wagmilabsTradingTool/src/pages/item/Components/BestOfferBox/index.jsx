import React from "react";
import { Col, Row } from "@Components";
import { MakeOffer } from "..";
import { useAcceptOffer } from "../../../../custom-hooks";

export const BestOfferBox = React.memo(({ details, address, isOwner }) => {
  const market = Object.values(details.market)[0];
  const topBid = details?.market?.topBid;
  const tokenId = details?.token?.tokenId || "";
  const marketplace = market?.source?.name || "";

  const { acceptOffer } = useAcceptOffer();

  return (
    <>
      {(!market.id && topBid?.id && (
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
              {isOwner ? (
                <div
                  className="btn"
                  onClick={() => acceptOffer(address, tokenId)}
                >
                  <i className="fa fa-check" />
                  Accept offer
                </div>
              ) : (
                <MakeOffer
                  address={address}
                  tokenId={tokenId}
                  marketplace={marketplace}
                />
              )}
            </Col>
          </Row>
        </div>
      )) ||
        ""}
    </>
  );
});
