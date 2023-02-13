import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import DarkUnica from "highcharts/themes/dark-unica";

import "./style.scss";

DarkUnica(Highcharts);

export const LineChart = ({
  title,
  subTitle,
  values,
  yAxisText = "",
  tooltipSuffix = null,
}) => {
  const [chartWidth, serChartWidth] = React.useState(920);

  React.useEffect(() => {
    serChartWidth(
      parseInt(
        document
          .getElementsByClassName("highcharts-container")[0]
          .style.width.replace("px", "")
      )
    );
  }, []);

  let step = Math.ceil(values.labels.length / 10);
  if (chartWidth < 800) step = Math.ceil(values.labels.length / 7.5);
  if (chartWidth < 700) step = Math.ceil(values.labels.length / 6);

  const options = {
    chart: {
      type: "spline",
      borderRadius: 15,
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
      labels: {
        rotation: 0,
        step,
      },
    },
    yAxis: [
      {
        title: {
          text: yAxisText,
        },
        labels: {
          overflow: "justify",
        },
      },
      {
        title: {
          text: "Offers",
        },
        labels: {
          overflow: "justify",
        },
        opposite: true,
      },
    ],
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
