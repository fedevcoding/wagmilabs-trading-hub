import React from "react";
import { NftDistribution, TradedDistribution } from "./Components";

import "./style.scss";

export const Stats = () => {
  return (
    <div className="row" id="stats">
      <NftDistribution />
      <TradedDistribution />
    </div>
  );
};
