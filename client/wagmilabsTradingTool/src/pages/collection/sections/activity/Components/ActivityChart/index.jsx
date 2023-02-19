import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export const ActivityChart = ({ activityChartData }) => {
  return (
    <div className="activity-chart-wrapper">
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

            // formatter: function () {
            //   return this.points.reduce(function (s, point) {
            //     return s + '<br/>' + point.series.name + ': ' + point.y + 'm';
            //   }, '<b>' + this.x + '</b>');
            // },

            // followPointer: true,
            hideDelay: 200,
            outside: false,
          },
        }}
      />
    </div>
  );
};
