import React from "react";
import {
  BarChart,
  LoadingSpinner,
  Select,
} from "../../../../../utility-components";
import { useGetTraders } from "./useGetTraders";

export const Traders = React.memo(({ traders, period, marketplaces }) => {
  const periods = ["24H", "7D", "30D", "3M", "1Y", "All"].map(p => ({
    value: p,
    label: p,
  }));

  const [currentPeriod, setPeriod] = React.useState(period);
  const [t, isLoading] = useGetTraders(
    traders,
    period,
    currentPeriod,
    marketplaces
  );

  return (
    <div className="tranders-chart chart-box">
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
          title="Traders"
          subTitle="The ranking of top marketplaces by the number of traders, buyers and sellers over the selected time range."
          yAxisText="Quantity"
          tooltipSuffix=" traders"
          values={t}
        />
      )}
    </div>
  );
});
