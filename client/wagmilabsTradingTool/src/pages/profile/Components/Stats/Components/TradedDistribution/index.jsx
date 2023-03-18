import React from "react";
import { Card } from "@Components";
import { useGetTradedNftDistribution } from "@Hooks";

export const TradedDistribution = () => {
  const { loading, nfts } = useGetTradedNftDistribution(450);

  console.log(nfts, loading);

  return (
    <div className="col">
      <Card>
        <h3>Traded Distribution</h3>
      </Card>
    </div>
  );
};
