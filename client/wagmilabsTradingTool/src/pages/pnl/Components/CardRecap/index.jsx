import React from "react";
import { Card, Col, Number, Row } from "@Components";
import { getRecap } from "./function";

export const CardRecap = React.memo(({ data, taxPerc, taxedOn, currency, taxLossHarvesting }) => {
  const { paid, sold, pAndL, taxes } = getRecap(data, taxPerc, taxedOn, taxLossHarvesting);

  return (
    <Card className="recap-card">
      <Row>
        <Col>
          <h3>Total spent:</h3>
          <p>{paid.eth + "ETH (" + paid.usd + "$)"}</p>
        </Col>
        <Col>
          <h3>Net P&L:</h3>
          <p>
            <Number n={pAndL.eth} symbol=" ETH" />
            {" ("}
            <Number n={pAndL.usd} symbol="$" crypto={false} />
            {")"}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Total sold:</h3>
          <p>{sold.eth + "ETH (" + sold.usd + "$)"}</p>
        </Col>
        <Col>
          <h3>Taxes owned:</h3>
          <p>{currency === "usd" ? taxes[currency] + "$" : taxes[currency] + " ETH"}</p>
        </Col>
      </Row>
    </Card>
  );
});
