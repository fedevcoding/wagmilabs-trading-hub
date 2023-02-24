import React from "react";
import { Card, Col, PageWrapper, Row } from "@Components";
import { CardRecap, SettingsAndFilters, Table } from "./Components";
import { useSetPageTitle } from "@Hooks";

import "./style.scss";
import { useTimeframe } from "./useTimeframe";
import { useGetData } from "./useGetData";
import { useSettings } from "./Components/useSettings";

export default React.memo(() => {
  useSetPageTitle("Portfolio P&L | Wagmi Labs");
  const { startDate, endDate, setStartDate, setEndDate } = useTimeframe();
  const { data } = useGetData(startDate, endDate);
  const settings = useSettings();
  console.log("data", data);

  return (
    <PageWrapper page="pnl">
      <h1>Portfolio P&L</h1>
      <Row>
        <Col>
          <CardRecap />
        </Col>
        <Col className="text-right">
          <SettingsAndFilters
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            {...settings}
          />
        </Col>
      </Row>
      <Card>
        <Table />
      </Card>
    </PageWrapper>
  );
});
