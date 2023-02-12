import moment from "moment";
import React from "react";
import {
  BarChart,
  LoadingSpinner,
  Select,
} from "../../../../../utility-components";
import { useGetSales } from "./useGetSales";

export const Sales = React.memo(({ sales, period, marketplace }) => {
  const periods = ["30D", "6M", "1Y", "All"].map(p => ({
    value: p,
    label: p,
  }));

  const [currentPeriod, setPeriod] = React.useState(period);
  const [v, isLoading] = useGetSales(sales, period, currentPeriod, marketplace);

  const values = {
    labels: v.map(v => moment(v.ts).format("DD/MM/YYYY")),
    values: v.map(v => v.sales),
  };

  React.useEffect(() => {
    setPeriod(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplace]);

  return (
    <div className="volumes-chart chart-box">
      <Select
        options={periods}
        value={periods.find(p => p.value === currentPeriod)}
        className="select-period"
        onChange={value => setPeriod(value.value)}
        isSearchable={false}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <BarChart
          title="Sales"
          subTitle="number of sales in set marketplace over the selected time range."
          yAxisText="Sales"
          values={values}
        />
      )}
    </div>
  );
});
