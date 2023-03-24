import React from "react";
import { Card, LoadingSpinner, PieChart } from "@Components";
import { useGetHoldingNftDistribution } from "@Hooks";

export const NftDistribution = () => {
  const { loading, distribution, tokenCount } = useGetHoldingNftDistribution();

  return (
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
  );
};
