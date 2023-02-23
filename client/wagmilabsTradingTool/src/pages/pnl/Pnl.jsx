import React from "react";
import { Col, PageWrapper, Row, Tabs } from "@Components";
import { CardRecap, Nft } from "./Components";
import { useGetTab, useSetPageTitle } from "@Hooks";

import "./style.scss";

export default React.memo(() => {
  useSetPageTitle("Portfolio P&L | Wagmi Labs");
  const defaultTab = "NFT";
  const tabs = [
    defaultTab,
    "Paid",
    "Sold",
    "Gas fees",
    "Pool",
    "Hold duration",
    "Gross profit",
    "Taxes",
    "Owned",
  ];
  const [tab, setTab] = useGetTab(tabs, defaultTab);

  return (
    <PageWrapper page="pnl">
      <h1>Portfolio P&L</h1>
      <Row>
        <Col>
          <CardRecap />
        </Col>
        <Col></Col>
      </Row>
      <Tabs tabs={tabs} active={tab} setTab={setTab} updateUrl />
      {tab === defaultTab ? <Nft /> : <p>Work in progress...</p>}
    </PageWrapper>
  );
});
