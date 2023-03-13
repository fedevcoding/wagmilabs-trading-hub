import React from "react";

export const ChartSelector = ({ charts, activeChart, changeChart }) => {
  return (
    <div className="charts-selector-container">
      {charts.map(currentChart => {
        return (
          <div
            className={`${activeChart.value === currentChart.value && "active"}`}
            onClick={() => changeChart(currentChart)}
            key={JSON.stringify(currentChart)}
          >
            {currentChart.name}
          </div>
        );
      })}
    </div>
  );
};
