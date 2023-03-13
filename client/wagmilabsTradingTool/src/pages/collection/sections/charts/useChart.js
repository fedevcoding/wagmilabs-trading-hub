import { useState } from "react";

const charts = [
  {
    name: "Floor price",
    value: "floorPrice",
  },
  {
    name: "Volume",
    value: "volume",
  },
  {
    name: "Sales",
    value: "sales",
  },
  {
    name: "Avg. price",
    value: "avgPrice",
  },
  {
    name: "Owner count",
    value: "ownerCount",
  },
];

const useChart = () => {
  const [activeChart, setChart] = useState(charts[0]);

  const changeChart = chart => {
    setChart(chart);
  };

  return { activeChart, changeChart, charts };
};
export default useChart;
