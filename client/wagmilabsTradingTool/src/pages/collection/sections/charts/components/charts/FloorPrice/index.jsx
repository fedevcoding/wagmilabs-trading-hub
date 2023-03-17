import { LoadingSpinner } from "@Components";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";
import ChartHeader from "./ChartHeader";
import { useGetData } from "./useGetData";
import { useRange } from "./useRange";

export const FloorChart = ({ collectionAddress }) => {
  const { range, setRange } = useRange();
  const { isLoading, chartOptions } = useGetData({ collectionAddress, range });

  return (
    <div className="floorprice-chart-section">
      <ChartHeader setRange={setRange} range={range} />
      {isLoading ? <LoadingSpinner /> : <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
    </div>
  );
};
