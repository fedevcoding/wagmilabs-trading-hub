import React from "react";
import { Col, Row } from "@Components";
import { useGetVariables } from "./useGetVariables";
import { MakeOffer } from "..";
import { CurrentPrice } from "./CurrentPrice";
import { SaleEnds } from "./SaleEnds";
import { AddOrRemoveToCart } from "./AddOrRemoveToCart";
import { BuyNow } from "./BuyNow";
import { CancelListing } from "./CancelListing";

import "./style.scss";

export const PriceBox = React.memo(
  ({ details, address, currency, ownerBestListing }) => {
    const { tokenId, value, marketplace, market } = useGetVariables(details);

    return (
      <>
        <SaleEnds validUntil={market?.validUntil} />
        {(market?.price && market?.price?.amount && (
          <div className="price-box">
            <CurrentPrice market={market} />
            <Row className="actions">
              {ownerBestListing ? (
                <Col>
                  <CancelListing listingId={market?.id} />
                </Col>
              ) : (
                <>
                  <Col>
                    <AddOrRemoveToCart details={details} address={address} />
                  </Col>
                  <Col>
                    <MakeOffer
                      address={address}
                      tokenId={tokenId}
                      marketplace={marketplace}
                      details={details}
                      currency={currency}
                    />
                  </Col>
                  <Col>
                    <BuyNow
                      details={details}
                      address={address}
                      tokenId={tokenId}
                      value={value}
                    />
                  </Col>
                </>
              )}
            </Row>
          </div>
        )) ||
          ""}
      </>
    );
  }
);
