import React from "react";
import "./style.scss";
import { PageWrapper } from "@Components";
import { ChartSelector, CollectionCharts } from "./components";
import useChart from "./useChart";

const Charts = () => {
  const { charts, activeChart, changeChart } = useChart();

  return (
    <PageWrapper page="collection-charts">
      <ChartSelector charts={charts} activeChart={activeChart} changeChart={changeChart} />

      <CollectionCharts activeChart={activeChart} />
    </PageWrapper>
  );
};
export default Charts;
