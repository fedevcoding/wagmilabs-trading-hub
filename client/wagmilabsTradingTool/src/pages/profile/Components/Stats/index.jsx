import React from "react";
import { NftDistribution, RealizedGains, TradedDistribution } from "./Components";

import "./style.scss";

export const Stats = React.memo(({ address }) => {
  return (
    <div id="stats">
      <div className="row">
        <NftDistribution />
        <TradedDistribution />
      </div>
      <RealizedGains address={address} />
    </div>
  );
});
