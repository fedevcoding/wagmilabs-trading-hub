import React from "react";
import { Card, Col, Row } from "@Components";
import { getRecap } from "./function";
import { roundPrice, roundPriceUsd } from "@Utils";

export const CardRecap = React.memo(({ data, taxPerc, taxedOn, currency }) => {
  const { paid, sold, pAndL, taxes } = getRecap(data, taxPerc, taxedOn);

  return (
    <Card className="recap-card">
      <Row>
        <Col>
          <h3>Total spent:</h3>
          <p>{paid.eth + "ETH (" + roundPriceUsd(paid.usd) + "$)"}</p>
        </Col>
        <Col>
          <h3>Net P&L:</h3>
          <p>{pAndL.eth + "ETH (" + roundPriceUsd(pAndL.usd) + "$)"}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Total sold:</h3>
          <p>{sold.eth + "ETH (" + roundPriceUsd(sold.usd) + "$)"}</p>
        </Col>
        <Col>
          <h3>Taxes owned:</h3>
          <p>{currency === "usd" ? roundPriceUsd(taxes[currency]) + "$" : roundPrice(taxes[currency]) + " ETH"}</p>
        </Col>
      </Row>
    </Card>
  );
});
