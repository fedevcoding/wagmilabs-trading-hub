import { LoadingSpinner } from "@Components";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";
import ChartHeader from "./ChartHeader";
import { useGetData } from "./useGetData";
import { useRange } from "./useRange";
import { NoDataFound } from "../../..";

export const NormalFloorChart = ({ collectionAddress, handleChartType }) => {
  const { range, setRange } = useRange();
  const { isLoading, chartOptions, hasNoData } = useGetData({ collectionAddress, range });

  return (
    <div className="floorprice-chart-section">
      <ChartHeader setRange={setRange} range={range} handleChartType={handleChartType} />
      {isLoading ? (
        <LoadingSpinner>
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
