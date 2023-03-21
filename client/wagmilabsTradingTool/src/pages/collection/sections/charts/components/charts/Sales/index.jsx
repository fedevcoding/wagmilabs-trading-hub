import React from "react";
import { LoadingSpinner } from "@Components";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { useGetData } from "./useGetData";
import ChartHeader from "./ChartHeader";
import { useRange } from "./useRange";
import { NoDataFound } from "../..";

export function SalesChart({ collectionAddress }) {
  const { setRange, range } = useRange();
  const { chartOptions, isLoading, hasNoData } = useGetData(collectionAddress, range);

  return (
    <div className="sales-chart-section">
      <ChartHeader setRange={setRange} range={range} />
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
}
