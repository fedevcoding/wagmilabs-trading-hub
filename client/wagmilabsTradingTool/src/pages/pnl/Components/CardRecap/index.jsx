import React from "react";
import { Card, Col, Row } from "@Components";
import { getRecap } from "./function";

export const CardRecap = React.memo(({ data }) => {
  const { paid } = getRecap(data);

  return (
    <Card className="recap-card">
      <Row>
        <Col>
          <h3>Total spent:</h3>
          <p>{paid.eth + "ETH (" + paid.usd + "$)"}</p>
        </Col>
        <Col>
          <h3>Net P&L:</h3>
          <p>0</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Total sold:</h3>
          <p>0</p>
        </Col>
        <Col>
          <h3>Taxes owned:</h3>
          <p>0</p>
        </Col>
      </Row>
    </Card>
  );
});
