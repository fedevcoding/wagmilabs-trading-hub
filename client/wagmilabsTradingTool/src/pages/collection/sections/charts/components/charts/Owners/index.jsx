import React from "react";
import { useGetData } from "./useGetData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const OwnersChart = ({ collectionSlug }) => {
  const { data, isLoading, chartOptions } = useGetData({ collectionSlug });
  return (
    <>
      <div>owners</div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </>
  );
};
