import React from "react";
import { Card } from "@Components";
import { NftDistribution } from "./Components";

import "./style.scss";

export const Stats = () => {
  return (
    <div className="row" id="stats">
      <NftDistribution />
      <div className="col">
        <Card>
          <h3>Traded Distribution</h3>
        </Card>
      </div>
    </div>
  );
};
