import React from "react";
import { useGetData } from "./useGetData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartHeader from "./ChartHeader";
import { LoadingSpinner } from "@Components";
import { useRange } from "./useRange";
import { NoDataFound } from "../..";

export const OwnersChart = ({ collectionSlug }) => {
  const { range, setRange } = useRange();
  const { isLoading, chartOptions, hasNoData } = useGetData({ collectionSlug, range });
  return (
    <>
      <div className="owners-chart-section">
        <ChartHeader range={range} setRange={setRange} />
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
    </>
  );
};
