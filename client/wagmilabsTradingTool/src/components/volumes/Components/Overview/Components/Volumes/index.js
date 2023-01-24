import React from "react";
import {
  BarChart,
  LoadingSpinner,
  Select,
} from "../../../../../utility-components";
import { useGetVolumes } from "./useGetVolumes";

export const Volumes = React.memo(({ volumes, period, marketplaces }) => {
  const periods = ["24h", "7d", "30d", "3M", "1y", "all"].map(p => ({
    value: p,
    label: p,
  }));

  const [currentPeriod, setPeriod] = React.useState(period);
  const [v, isLoading] = useGetVolumes(
    volumes,
    period,
    currentPeriod,
    marketplaces
  );

  console.log(v);

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
          title="Volumes"
          subTitle="The ranking of top marketplaces by the volume over the selected time range."
          yAxisText="Quantity"
          tooltipSuffix=" ETH"
          values={v}
          useMarketImg
        />
      )}
    </div>
  );
});
