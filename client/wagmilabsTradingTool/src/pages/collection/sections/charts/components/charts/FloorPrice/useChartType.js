import { useState } from "react";

export const useChartType = () => {
  const [chartType, setChartType] = useState("normal");

  const handleChartType = type => {
    setChartType(type);
  };

  return { chartType, handleChartType };
};
