import moment from "moment";
import React from "react";
import { useGetItemFunctions } from "../../../../custom-hooks";
import { Col, Row } from "../../../utility-components";
import { useGetVariables } from "./useGetVariables";

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
          {(market?.validUntil && (
            <p className="valid-until">
              <i className="fa fa-clock" />
              {"Sale ends "}
              {moment(market.validUntil * 1000).format("MMM DD, YYYY HH:mm")}
            </p>
          )) ||
            ""}
          {(market?.price && market?.price?.amount && (
            <div className="price-box">
              <p className="current-price">Current price</p>
              <div className="price">
                {market.price.amount.decimal} {market.price.currency.symbol}
                <small>
                  $
                  {market.price.amount.usd.toLocaleString("EN-us", {
                    maximumFractionDigits: 2,
                  })}
                </small>
              </div>
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
                  <div className="btn">
                    <i className="fa fa-tag" />
                    Make offer
                  </div>
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
