import React from "react";
import { useGetData } from "./useGetData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartHeader from "./ChartHeader";
import { LoadingSpinner } from "@Components";

export const OwnersChart = ({ collectionSlug }) => {
  const { isLoading, chartOptions } = useGetData({ collectionSlug });
  return (
    <>
      <div className="owners-chart-section">
        <ChartHeader />
        {isLoading ? <LoadingSpinner /> : <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
      </div>
    </>
  );
};
