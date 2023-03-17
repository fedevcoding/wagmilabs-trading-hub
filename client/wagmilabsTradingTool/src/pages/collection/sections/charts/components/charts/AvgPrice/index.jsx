import React from "react";
import { LoadingSpinner } from "@Components";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { useGetData } from "./useGetData";
import ChartHeader from "./ChartHeader";
import { useRange } from "./useRange";

export function AvgPriceChart({ collectionAddress }) {
  const { setRange, range } = useRange();
  const { chartOptions, isLoading } = useGetData(collectionAddress, range);

  return (
    <div className="avgprice-chart-section">
      <ChartHeader setRange={setRange} range={range} />
      {isLoading ? <LoadingSpinner /> : <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
    </div>
  );
}
