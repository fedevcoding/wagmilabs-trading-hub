import React from "react";
import moment from "moment";
import {
  BarChart,
  LoadingSpinner,
  Select,
} from "../../../../../utility-components";
import { useGetVolumes } from "./useGetVolumes";

export const Volumes = React.memo(({ volumes, period, marketplace }) => {
  const periods = ["30D", "6M", "1Y", "All"].map(p => ({
    value: p,
    label: p,
  }));

  const [currentPeriod, setPeriod] = React.useState(period);
  const [v, isLoading] = useGetVolumes(
    volumes,
    period,
    currentPeriod,
    marketplace
  );

  const values = {
    labels: v.map(v => moment(v.ts).format("DD/MM/YYYY")),
    values: v.map(v => v.volume_eth),
    secondValue: v.map(v => v.volume.toLocaleString("EN-us")),
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
          title="Volumes"
          subTitle="The volume of exchanges in dollars and ETHs in the selected range is shown."
          tooltipSuffix=" ETH"
          yAxisText="Quantity"
          values={values}
        />
      )}
    </div>
  );
});
