import React from "react";
import { BarChart, Select } from "../../../../../utility-components";
import { useGetVolumes } from "./useGetVolumes";

export const Volumes = React.memo(({ volumes, period, marketplaces }) => {
  const periods = ["24H", "7D", "30D", "3M", "1Y", "All"].map(p => ({
    value: p,
    label: p,
  }));

  const [currentPeriod, setPeriod] = React.useState(period);
  const v = useGetVolumes(volumes, period, currentPeriod, marketplaces);

  return (
    <div className="volumes-chart chart-box">
      <Select
        options={periods}
        value={periods.find(p => p.value === currentPeriod)}
        className="select-period"
        onChange={value => setPeriod(value.value)}
      />
      <BarChart
        title="Volumes"
        subTitle="The ranking of top marketplaces by the volume over the selected time range."
        yAxisText="Quantity"
        tooltipSuffix=" ETH"
        values={v}
      />
    </div>
  );
});
