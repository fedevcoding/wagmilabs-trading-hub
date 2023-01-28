import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import DarkUnica from "highcharts/themes/dark-unica";

import "./style.css";

DarkUnica(Highcharts);

export const LineChart = ({
  title,
  subTitle,
  values,
  yAxisText = "",
  tooltipSuffix = null,
}) => {
  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: title,
      align: "left",
      x: 20,
      y: 30,
      margin: 50,
    },
    subtitle: {
      text: subTitle,
      align: "left",
      x: 20,
      y: 60,
    },
    xAxis: {
      categories: values.labels,
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxisText,
      },
      labels: {
        overflow: "justify",
      },
    },
    ...(tooltipSuffix
      ? {
          tooltip: {
            formatter: function () {
              return (
                this.key +
                `<br>` +
                this.series.name +
                " " +
                yAxisText +
                ": " +
                this.y
              );
            },
          },
        }
      : {}),
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false,
    },
    series: values.series,
  };
  return (
    <div className="line-chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
