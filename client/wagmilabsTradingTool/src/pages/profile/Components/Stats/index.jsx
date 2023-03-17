import { Card, LoadingSpinner, PieChart } from "@Components";
import { useGetHoldingNftDistribution } from "@Hooks";
import React from "react";

import "./style.scss";

export const Stats = () => {
  const { loading, distribution, tokenCount } = useGetHoldingNftDistribution();

  console.log(loading, distribution, tokenCount);

  return (
    <div className="row" id="stats">
      <div className="col">
        <Card>
          <h3>Holding NFT Distribution</h3>
          {(loading && <LoadingSpinner />) || (
            <PieChart
              title={"Distribution"}
              countElements={tokenCount}
              items={Object.values(distribution).map(d => ({
                name: d.name,
                y: d.count,
              }))}
            />
          )}
        </Card>
      </div>
      <div className="col"></div>
    </div>
  );
};
