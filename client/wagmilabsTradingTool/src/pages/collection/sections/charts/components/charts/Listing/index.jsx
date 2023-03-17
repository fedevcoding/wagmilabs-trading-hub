import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetData } from "./useGetData";
import ChartHeader from "./ChartHeader";
import { LoadingSpinner } from "@Components";
import { useRange } from "./useRange";

export const ListingChart = ({ collectionAddress }) => {
  const { range, setRange } = useRange();
  const { isLoading, chartOptions } = useGetData({ range, collectionAddress });

  return (
    <div className="listings-chart-section">
      <ChartHeader setRange={setRange} range={range} />
      {isLoading ? <LoadingSpinner /> : <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
    </div>
  );
};
