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
  const { address } = useAccount();
  useSetPageTitle("Portfolio P&L | Wagmi Labs");
  const { startDate, endDate, setStartDate, setEndDate } = useTimeframe();
  const { data, isLoading } = useGetData(address, startDate, endDate);
  const settings = useSettings();

  return (
    <PageWrapper page="pnl">
      <h1>Portfolio P&L</h1>
      <Row>
        <Col>
          <CardRecap
            data={data}
            taxPerc={settings.taxPerc}
            currency={settings.currency.value}
            taxedOn={settings.taxedOn.value}
            taxLossHarvesting={settings.taxLossHarvesting}
            longTermTax={settings.longTermTax}
          />
        </Col>
        <Col className="text-right settings">
          <SettingsAndFilters
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            data={data}
            {...settings}
          />
        </Col>
      </Row>
      <Card>
        {data && !(!(data || []).length && isLoading) ? (
          <Table
            data={data}
            taxPerc={settings.taxPerc}
            taxedOn={settings.taxedOn.value}
            currency={settings.currency.value}
            longTermTax={settings.longTermTax}
            isLoading={isLoading}
          />
        ) : (
          <LoadingSpinner />
        )}
      </Card>
    </PageWrapper>
  );
});
