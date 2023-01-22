import { BarChart } from "../../../../../utility-components";

export const Volumes = ({ marketplaces }) => {
  const values = [4561, 1276, 1007, 746, 42];

  return (
    <BarChart
      title="Volumes"
      subTitle="The ranking of top marketplaces by the volume over the selected time range."
      yAxisText="Quantity"
      tooltipSuffix=" ETH"
      values={{
        labels: marketplaces,
        values,
      }}
    />
  );
};
