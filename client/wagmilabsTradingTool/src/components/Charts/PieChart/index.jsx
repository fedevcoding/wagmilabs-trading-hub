import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DarkUnica from "highcharts/themes/dark-unica";

DarkUnica(Highcharts);

export const PieChart = ({ items, title, countElements }) => {
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: countElements.toString(),
      align: "center",
      verticalAlign: "middle",
      y: 20,
      x: 90,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b><br />Items: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        innerSize: "60%",
        dataLabels: false,
        showInLegend: true,
      },
    },
    series: [
      {
        name: title,
        colorByPoint: true,
        data: items,
      },
    ],
    legend: {
      align: "left",
      verticalAlign: "middle",
      backgroundColor: "transparent",
      layout: "vertical",
      borderWidth: 0,
      itemMarginBottom: 10,
      labelFormatter: function () {
        const percentage = (this.y / this.series.yData.reduce((a, b) => a + b, 0)) * 100;
        return `${this.name}: ${this.y} (${percentage.toFixed(1)}%)`;
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
