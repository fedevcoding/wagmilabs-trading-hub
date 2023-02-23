import React from "react";
import { PageWrapper, Tabs } from "@Components";
import { Overview, Markets } from "./Components";
import { useGetTab } from "./Components/useGetTab";
import { useSetPageTitle } from "@Hooks";

import "./style.scss";

const Volumes = React.memo(() => {
  useSetPageTitle("Volumes | Wagmi Labs");
  const marketplaces = ["OpenSea", "Blur", "X2Y2", "LooksRare", "SudoSwap"];
  const tabs = ["Overview", ...marketplaces];
  const [tab, setTab] = useGetTab(marketplaces);

  return (
    <PageWrapper page="volumes">
      <Tabs tabs={tabs} active={tab} setTab={setTab} updateUrl />
      {tab === "Overview" ? (
        <Overview marketplaces={marketplaces} />
      ) : (
        <Markets marketplace={tab} />
      )}
    </PageWrapper>
  );
});

export default Volumes;
