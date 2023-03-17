import React from "react";
import { useGetData } from "./useGetData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartHeader from "./ChartHeader";
import { LoadingSpinner } from "@Components";
import { useRange } from "./useRange";

export const OwnersChart = ({ collectionSlug }) => {
  const { range, setRange } = useRange();
  const { isLoading, chartOptions } = useGetData({ collectionSlug, range });
  return (
    <>
      <div className="owners-chart-section">
        <ChartHeader range={range} setRange={setRange} />
        {isLoading ? (
          <LoadingSpinner>
            <p>Loading chart...</p>
          </LoadingSpinner>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        )}
      </div>
    </>
  );
};
