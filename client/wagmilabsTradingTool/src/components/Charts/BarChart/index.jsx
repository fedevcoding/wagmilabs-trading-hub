import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DarkUnica from "highcharts/themes/dark-unica";

import "./style.scss";

DarkUnica(Highcharts);

export const BarChart = ({
  title,
  subTitle,
  values,
  yAxisText = "",
  tooltipSuffix = undefined,
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

  return (
    <div className="bar-chart">
      <HighchartsReact
        className="chart"
        highcharts={Highcharts}
        options={{
          chart: {
            type: "column",
            marginLeft: 100,
            marginRight: 30,
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
                valueSuffix: tooltipSuffix,
                formatter: function () {
                  let amount = this.y;
                  if (typeof amount === "number") {
                    amount = amount.toLocaleString("EN-us", {
                      maximumFractionDigits: 2,
                    });
                  }
                  const dollarValue = (values?.secondValue || [])[
                    this.point.index
                  ];
                  const label = (values?.labels || [])[this.point.index];
                  return (
                    label +
                    "<br><br>" +
                    (dollarValue
                      ? amount + ` ${tooltipSuffix}<br>$` + dollarValue
                      : amount + tooltipSuffix)
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
          series: [
            {
              name: title,
              data: values.values,
              borderRadius: 3,
            },
          ],
        }}
      />
    </div>
  );
};
