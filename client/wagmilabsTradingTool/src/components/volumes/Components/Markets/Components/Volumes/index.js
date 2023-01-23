import React from "react";
import { Select } from "../../../../../utility-components";

export const Volumes = React.memo(({ volumes, period, marketplace }) => {
  const periods = ["24H", "7D", "30D", "3M", "1Y", "All"].map(p => ({
    value: p,
    label: p,
  }));

  const [currentPeriod, setPeriod] = React.useState(period);

  return (
    <div className="volumes-chart chart-box">
      <Select
        options={periods}
        value={periods.find(p => p.value === currentPeriod)}
        className="select-period"
        onChange={value => setPeriod(value.value)}
      />
    </div>
  );
});
