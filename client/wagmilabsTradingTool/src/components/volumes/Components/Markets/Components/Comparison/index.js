import React from "react";
import { Select } from "../../../../../utility-components";

export const Comparison = React.memo(
  ({ comparisonData, period, marketplace }) => {
    const periods = ["30D", "6M", "1Y", "All"].map(p => ({
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
  }
);
