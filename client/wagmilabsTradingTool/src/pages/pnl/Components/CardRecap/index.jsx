import React from "react";
import { Card, Col, Row } from "@Components";
import { getRecap } from "./function";
import { roundPrice } from "@Utils";

export const CardRecap = React.memo(({ data, taxPerc, taxedOn, currency }) => {
  const { paid, sold, pAndL, taxes } = getRecap(data, taxPerc, taxedOn);

  return (
    <Card className="recap-card">
      <Row>
        <Col>
          <h3>Total spent:</h3>
          <p>{paid.eth + "ETH (" + paid.usd + "$)"}</p>
        </Col>
        <Col>
          <h3>Net P&L:</h3>
          <p>{pAndL.eth + "ETH (" + pAndL.usd + "$)"}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Total sold:</h3>
          <p>{sold.eth + "ETH (" + sold.usd + "$)"}</p>
        </Col>
        <Col>
          <h3>Taxes owned:</h3>
          <p>
            {roundPrice(taxes[currency]) + (currency === "usd" ? "$" : " ETH")}
          </p>
        </Col>
      </Row>
    </Card>
  );
});
