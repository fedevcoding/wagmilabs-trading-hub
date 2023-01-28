import React from "react";
import moment from "moment";
import {
  LineChart,
  LoadingSpinner,
  Select,
} from "../../../../../utility-components";
import { useGetComparisonData } from "./useGetComparisonData";

export const Comparison = React.memo(
  ({ comparisonData, period, marketplace }) => {
    const periods = ["30D", "6M", "1Y", "All"].map(p => ({
      value: p,
      label: p,
    }));

    const [currentPeriod, setPeriod] = React.useState(period);
    const [v, isLoading] = useGetComparisonData(
      comparisonData,
      period,
      currentPeriod,
      marketplace
    );

    const values = {
      labels: v.map(v => moment(v.ts).format("DD/MM/YYYY")),
      series: [
        {
          name: "ETH",
          data: v.map(s => s.count_eth_sales),
        },
        {
          name: "WETH",
          data: v.map(s => s.count_weth_sales),
        },
      ],
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
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <LineChart
            title="Sales volumes of ETH and WETH"
            subTitle="The comparison between sales and offer in the marketplace over the selected time range."
            yAxisText="Sales"
            values={values}
            tooltipSuffix={true}
          />
        )}
      </div>
    );
  }
);
