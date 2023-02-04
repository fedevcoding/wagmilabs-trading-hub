import React from "react";
import { useGetItemFunctions } from "../../../../custom-hooks";
import { Col, Row } from "../../../utility-components";
import { useGetVariables } from "./useGetVariables";
import { MakeOffer } from "..";
import { CurrentPrice } from "./CurrentPrice";
import { SaleEnds } from "./SaleEnds";

import "./style.css";

export const PriceBox = React.memo(({ details, address }) => {
  const { addItemToCart, buyNow } = useGetItemFunctions(address);
  const {
    name,
    tokenId,
    value,
    image,
    marketplace,
    collectionName,
    market,
    isOwner,
  } = useGetVariables(details);

  return (
    <>
      {(!isOwner && (
        <>
          <SaleEnds validUntil={market?.validUntil} />
          {(market?.price && market?.price?.amount && (
            <div className="price-box">
              <CurrentPrice market={market} />
              <Row className="actions">
                <Col>
                  <div
                    className="btn"
                    onClick={() =>
                      addItemToCart(
                        name,
                        tokenId,
                        value,
                        image,
                        marketplace,
                        collectionName
                      )
                    }
                  >
                    <i className="fa fa-cart-shopping" />
                    Add to cart
                  </div>
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
      )) ||
        ""}
    </>
  );
});
