import React from "react";
import { Card, Col, LoadingSpinner, PageWrapper, Row } from "@Components";
import { CardRecap, SettingsAndFilters, Table } from "./Components";
import { useSetPageTitle } from "@Hooks";

import "./style.scss";
import { useTimeframe } from "./useTimeframe";
import { useGetData } from "./useGetData";
import { useSettings } from "./useSettings";
import { useAccount } from "wagmi";

export default React.memo(() => {
  // const address = "0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E";
  const { address } = useAccount();
  useSetPageTitle("Portfolio P&L | Wagmi Labs");
  const { startDate, endDate, setStartDate, setEndDate } = useTimeframe();
  const { data } = useGetData(address, startDate, endDate);
  const settings = useSettings();
  console.log("data", data);

  return (
    <PageWrapper page="pnl">
      <h1>Portfolio P&L</h1>
      <Row>
        <Col>
          <CardRecap data={data} />
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
        {data ? (
          <Table
            data={data}
            taxPerc={settings.taxPerc}
            taxedOn={settings.taxedOn.value}
          />
        ) : (
          <LoadingSpinner />
        )}
      </Card>
    </PageWrapper>
  );
});
