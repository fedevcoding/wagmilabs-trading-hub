import React, { useEffect } from "react";
import { setPageTitle } from "@Utils";
import { PageWrapper, Tabs } from "@Components";
import { Overview, Markets } from "./Components";
import { useGetTab } from "./Components/useGetTab";

import "./style.scss";

const Volumes = React.memo(() => {
  useEffect(() => {
    setPageTitle("Volumes | Wagmi Labs");
  }, []);
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
