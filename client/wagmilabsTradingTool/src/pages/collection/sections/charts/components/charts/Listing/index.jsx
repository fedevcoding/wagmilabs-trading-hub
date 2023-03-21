import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetData } from "./useGetData";
import ChartHeader from "./ChartHeader";
import { LoadingSpinner } from "@Components";
import { useRange } from "./useRange";
import { NoDataFound } from "../..";

export const ListingChart = ({ collectionAddress }) => {
  const { range, setRange } = useRange();
  const { isLoading, chartOptions, hasNoData, chartType, setChartType } = useGetData({ range, collectionAddress });

  return (
    <div className="listings-chart-section">
      <ChartHeader setRange={setRange} range={range} chartType={chartType} setChartType={setChartType} />
      {isLoading ? (
        <LoadingSpinner margin="50px 0 0 0">
          <p>Loading chart...</p>
        </LoadingSpinner>
      ) : hasNoData ? (
        <NoDataFound />
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </div>
  );
};
