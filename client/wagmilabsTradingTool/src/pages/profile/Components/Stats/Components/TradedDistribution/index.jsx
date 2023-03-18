import React from "react";
import { Card, Tabs } from "@Components";
import { useGetTradedNftDistribution } from "@Hooks";
import Chart from "./Chart";

export const TradedDistribution = () => {
  const periods = {
    "7d": 7,
    "30d": 30,
    "3M": 90,
    "1y": 365,
    all: 1800,
  };
  const [currentPeriod, setPeriod] = React.useState("30d");

  const { loading, nfts } = useGetTradedNftDistribution(periods[currentPeriod]);

  console.log(nfts, loading);

  return (
    <div className="col">
      <Card>
        <div className="space-between">
          <h3>Traded Distribution</h3>
          <Tabs tabs={Object.keys(periods)} active={currentPeriod} setTab={value => setPeriod(value)} />
        </div>
        <Chart data={nfts} />
      </Card>
    </div>
  );
};
