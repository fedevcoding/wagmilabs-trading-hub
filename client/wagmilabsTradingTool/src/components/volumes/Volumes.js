import React from "react";
import { PageWrapper, Tabs } from "../utility-components";
import { Overview } from "./Components";
import { Markets } from "./Components/Markets";
import { useGetTab } from "./Components/useGetTab";

import "./style.css";

const Volumes = React.memo(() => {
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
