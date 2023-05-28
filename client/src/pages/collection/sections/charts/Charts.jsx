import React from "react";
import "./style.scss";
import { PageWrapper } from "@Components";
import { ChartSelector, CollectionCharts } from "./components";
import useChart from "./useChart";

const Charts = ({ collectionAddress, collectionSlug, floorPrice, collectionName }) => {
  const { charts, activeChart, changeChart } = useChart();

  return (
    <PageWrapper page="collection-charts">
      <ChartSelector charts={charts} activeChart={activeChart} changeChart={changeChart} />

      <CollectionCharts
        activeChart={activeChart}
        charts={charts}
        collectionAddress={collectionAddress}
        collectionSlug={collectionSlug}
        floorPrice={floorPrice}
        collectionName={collectionName}
      />
    </PageWrapper>
  );
};
export default Charts;
