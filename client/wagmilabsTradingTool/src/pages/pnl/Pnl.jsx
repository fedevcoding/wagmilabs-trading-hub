import React from "react";
import { Card, Col, PageWrapper, Row } from "@Components";
import { CardRecap, SettingsAndFilters, Table } from "./Components";
import { useSetPageTitle } from "@Hooks";

import "./style.scss";

export default React.memo(() => {
  useSetPageTitle("Portfolio P&L | Wagmi Labs");

  return (
    <PageWrapper page="pnl">
      <h1>Portfolio P&L</h1>
      <Row>
        <Col>
          <CardRecap />
        </Col>
        <Col className="text-right">
          <SettingsAndFilters />
        </Col>
      </Row>
      <Card>
        <Table />
      </Card>
    </PageWrapper>
  );
});
