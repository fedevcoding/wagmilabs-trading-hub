import { BarChart } from "../../../../../utility-components";

export const Traders = ({ marketplaces }) => {
  const values = [4561, 1276, 1007, 746, 42];

  return (
    <BarChart
      title="Traders"
      subTitle="The ranking of top marketplaces by the number of traders, buyers and sellers over the selected time range."
      yAxisText="Quantity"
      tooltipSuffix=" ETH"
      values={{
        labels: marketplaces,
        values,
      }}
    />
  );
};
