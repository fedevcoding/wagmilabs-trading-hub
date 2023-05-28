import React from "react";
import { chartMapping } from "./options";

import "./style.scss";
export const ChartSelector = ({ onChange, chart1Type, chart2Type, chartType }) => {
  const handleClick = chartType => {
    onChange(chartType);
  };

  return (
    <div className="chart-type-selector-component">
      <i
        className={`fa-solid ${chartMapping[chart1Type]} ${chartType === chart1Type && "selected"}`}
        onClick={() => handleClick(chart1Type)}
      ></i>
      <i
        className={`fa-sharp fa-solid  ${chartMapping[chart2Type]} ${chartType === chart2Type && "selected"}`}
        onClick={() => handleClick(chart2Type)}
      ></i>
    </div>
  );
};
