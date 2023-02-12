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
          title="Volumes"
          subTitle="exchange volume in dollars and ETH in the selected time range."
          tooltipSuffix=" ETH"
          yAxisText="Quantity"
          values={values}
        />
      )}
    </div>
  );
});
