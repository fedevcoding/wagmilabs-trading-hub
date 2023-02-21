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
import { NumberInput, NumberInputField } from "@chakra-ui/react";

export const PriceBox = React.memo(
  ({ details, address, currency, ownerBestListing, isErc721 }) => {
    const [quantity, setQuantity] = React.useState(1);
    const { tokenId, value, marketplace, market } = useGetVariables(details);

    return (
      <>
        <SaleEnds validUntil={market?.validUntil} />
        {(market?.price && market?.price?.amount && (
          <div className="price-box">
            <div className="space-between">
              <div>
                <CurrentPrice market={market} />
              </div>
              {(!isErc721 && (market?.quantityRemaining || 0) > 1 && (
                <div className="amount">
                  <p className="text-right">Quantity</p>
                  <NumberInput
                    min={1}
                    max={market?.quantityRemaining}
                    defaultValue={quantity}
                  >
                    <NumberInputField
                      onChange={e => setQuantity(e.target.value)}
                    />
                  </NumberInput>
                </div>
              )) ||
                ""}
            </div>
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
                      quantity={quantity}
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
