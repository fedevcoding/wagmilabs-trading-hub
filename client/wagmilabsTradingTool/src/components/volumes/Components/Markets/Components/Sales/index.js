import moment from "moment";
import React from "react";
import {
  BarChart,
  LoadingSpinner,
  Select,
} from "../../../../../utility-components";
import { useGetSales } from "./useGetSales";

export const Sales = React.memo(({ sales, period, marketplace }) => {
  const periods = ["10D", "30D", "6M", "1Y", "All"].map(p => ({
    value: p,
    label: p,
  }));

  const [currentPeriod, setPeriod] = React.useState(period);
  const [v, isLoading] = useGetSales(sales, period, currentPeriod, marketplace);

  const values = {
    labels: v.map(v => moment(v.ts).format("DD/MM/YYYY")),
    values: v.map(v => v.sales),
  };

  return (
    <div className="volumes-chart chart-box">
      <Select
        options={periods}
        value={periods.find(p => p.value === currentPeriod)}
        className="select-period"
        onChange={value => setPeriod(value.value)}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <BarChart
          title="Sales"
          subTitle="The number of sales in the marketplace over the selected time range."
          yAxisText="Sales"
          values={values}
        />
      )}
    </div>
  );
});
