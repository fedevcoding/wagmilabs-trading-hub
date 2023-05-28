import React from "react";

export const ChartSelector = ({ charts, activeChart, changeChart }) => {
  return (
    <div className="charts-selector-container">
      {charts.map(currentChart => {
        const { value, name } = currentChart;
        const inactiveChart = value === "mixedChart";

        return (
          <div
            className={`${activeChart.value === value && "active"} ${inactiveChart && "not-allowed"}`}
            onClick={() => !inactiveChart && changeChart(currentChart)}
            key={JSON.stringify(currentChart)}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
};
