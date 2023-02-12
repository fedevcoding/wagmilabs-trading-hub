import React from "react";
import { useGetItemFunctions } from "../../../../custom-hooks";
import { Col, Row } from "../../../utility-components";
import { useGetVariables } from "./useGetVariables";
import { MakeOffer } from "..";
import { CurrentPrice } from "./CurrentPrice";
import { SaleEnds } from "./SaleEnds";

import "./style.scss";
import { AddOrRemoveToCart } from "./AddOrRemoveToCart";

export const PriceBox = React.memo(({ details, address }) => {
  const { buyNow } = useGetItemFunctions(address);
  const { tokenId, value, marketplace, market } = useGetVariables(details);

  return (
    <>
      <SaleEnds validUntil={market?.validUntil} />
      {(market?.price && market?.price?.amount && (
        <div className="price-box">
          <CurrentPrice market={market} />
          <Row className="actions">
            <Col>
              <AddOrRemoveToCart details={details} address={address} />
            </Col>
            <Col>
              <MakeOffer
                address={address}
                tokenId={tokenId}
                marketplace={marketplace}
              />
            </Col>
            <Col>
              <div
                className="btn"
                onClick={() => buyNow(address, tokenId, value)}
              >
                <i className="fa fa-bolt" />
                Buy now
              </div>
            </Col>
          </Row>
        </div>
      )) ||
        ""}
    </>
  );
});
