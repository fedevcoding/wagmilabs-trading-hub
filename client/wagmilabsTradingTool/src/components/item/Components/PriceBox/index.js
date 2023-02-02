import moment from "moment";
import React from "react";
import { useAccount } from "wagmi";
import { Col, Row } from "../../../utility-components";

import "./style.css";

export const PriceBox = React.memo(({ details }) => {
  const { address: accountAddress } = useAccount();
  const isOwner = details ? accountAddress === details?.token?.owner : false;
  const market = Object.values(details.market)[0];

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
                  <div className="btn">
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
                  <div className="btn">
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
