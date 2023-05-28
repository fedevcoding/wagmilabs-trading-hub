import { useState } from "react";

const charts = [
  {
    name: "Floor price",
    value: "floorPrice",
  },
  {
    name: "Buyers/sellers",
    value: "buyers/sellers",
  },
  {
    name: "Listings",
    value: "listings",
  },
  {
    name: "Owners",
    value: "owners",
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
    name: "Mixed chart",
    value: "mixedChart",
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
