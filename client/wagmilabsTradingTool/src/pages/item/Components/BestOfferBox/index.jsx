import React from "react";
import { Col, Row } from "@Components";
import { MakeOffer } from "..";
import { getMarketplaceImage } from "@Utils";
import { AcceptOffer } from "./AcceptOffer";

export const BestOfferBox = React.memo(
  ({ details, address, isOwner, currency }) => {
    const market = Object.values(details.market)[0];
    const topBid = details?.market?.topBid;
    const tokenId = details?.token?.tokenId || "";
    const marketplace = topBid?.source?.name || "";
    const marketplaceImage = getMarketplaceImage(marketplace);

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
            <small className="market-from">
              From {marketplace}
              <img
                src={marketplaceImage}
                alt={marketplace}
                width={20}
                className="market-img"
              />
            </small>
            <Row className="actions">
              <Col>
                {isOwner ? (
                  <AcceptOffer
                    details={details}
                    tokenId={tokenId}
                    address={address}
                  />
                ) : (
                  <MakeOffer
                    address={address}
                    tokenId={tokenId}
                    marketplace={marketplace}
                    details={details}
                    currency={currency}
                  />
                )}
              </Col>
            </Row>
          </div>
        )) ||
          ""}
      </>
    );
  }
);
