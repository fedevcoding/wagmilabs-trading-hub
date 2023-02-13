import moment from "moment";
import React from "react";
import { BarChart, LoadingSpinner, Select } from "@Components";
import { useGetActiveTraders } from "./useGetActiveTraders";

export const ActiveTraders = React.memo(
  ({ activeTraders, period, marketplace }) => {
    const periods = ["30D", "6M", "1Y", "All"].map(p => ({
      value: p,
      label: p,
    }));

    const [currentPeriod, setPeriod] = React.useState(period);
    const [v, isLoading] = useGetActiveTraders(
      activeTraders,
      period,
      currentPeriod,
      marketplace
    );

    const values = {
      labels: v.map(v => moment(v.ts).format("DD/MM/YYYY")),
      values: v.map(v => v.active_traders),
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
            title="Active Traders"
            subTitle="number of active traders in set marketplace over the selected time range."
            yAxisText="Active Traders"
            values={values}
          />
        )}
      </div>
    );
  }
);
