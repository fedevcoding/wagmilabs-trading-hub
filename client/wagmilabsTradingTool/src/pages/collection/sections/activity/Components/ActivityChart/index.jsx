import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export const ActivityChart = React.memo(({ activityChartData }) => {
  return (
    <HighchartsReact
      className="activity-chart"
      highcharts={Highcharts}
      options={{
        series: [
          {
            type: "column",
            name: "Volume",
            data: activityChartData?.volumes,
            yAxis: 1,
          },
          {
            type: "spline",
            name: "Average price",
            data: activityChartData?.averagePrices,
          },
        ],
        xAxis: {
          categories: activityChartData?.days,
        },
        yAxis: [
          {
            title: {
              text: "Avg. price",
            },
            resize: {
              enabled: true,
            },
          },
          {
            title: {
              text: "ETH volume",
            },
            opposite: true,
          },
        ],
        legend: {},
        title: {
          text: "",
        },
        chart: {
          type: "spline",
          backgroundColor: "transparent",
          borderRadius: 10,
        },
        tooltip: {
          shared: true,
          formatter: function () {
            const index = this.points[0].point.index;
            return (
              this.points.reduce(function (s, point) {
                return s + "<br/>" + point.series.name + ": " + point.y + "m";
              }, "<b>" + this.x + "</b>") +
              "<br/>Sales: " +
              activityChartData.sales[index]
            );
          },
          hideDelay: 200,
          outside: false,
        },
      }}
    />
  );
});
