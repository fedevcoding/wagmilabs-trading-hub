import React from "react";
import { PageWrapper, Tabs } from "../utility-components";
import { Overview } from "./Components";

import "./style.css";

const Volumes = React.memo(() => {
  const marketplaces = ["OpenSea", "Blur", "X2Y2", "LooksRare", "SudoSwap"];
  const tabs = ["Overview", ...marketplaces];
  const [tab, setTab] = React.useState("Overview");

  return (
    <PageWrapper page="volumes">
      <Tabs tabs={tabs} active={tab} setTab={setTab} />
      {tab === "Overview" && <Overview marketplaces={marketplaces} />}
    </PageWrapper>
  );
});

export default Volumes;
