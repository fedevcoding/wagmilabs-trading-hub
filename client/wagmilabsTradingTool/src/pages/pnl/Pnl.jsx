import React from "react";
import { PageWrapper, Tabs } from "@Components";
import { Nft } from "./Components";
import { useSetPageTitle } from "@Hooks";

import "./style.scss";

export default React.memo(() => {
  useSetPageTitle("Portfolio P&L | Wagmi Labs");

  const defaultTab = "NFT";

  const tabs = [defaultTab, "Blur", "X2Y2", "LooksRare", "SudoSwap"];
  const [tab, setTab] = React.useState(defaultTab);

  return (
    <PageWrapper page="pnl">
      <Tabs tabs={tabs} active={tab} setTab={setTab} updateUrl />
      {tab === defaultTab ? <Nft /> : <p>Hello</p>}
    </PageWrapper>
  );
});
