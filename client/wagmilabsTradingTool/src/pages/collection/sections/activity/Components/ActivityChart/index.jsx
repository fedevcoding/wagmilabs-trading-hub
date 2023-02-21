import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export const ActivityChart = React.memo(({ activityChartData }) => {
  const [chartWidth, serChartWidth] = React.useState(1140);

  React.useEffect(() => {
    serChartWidth(
      parseInt(
        document
          .getElementsByClassName("highcharts-container")[0]
          .style.width.replace("px", "")
      )
    );
  }, []);

  let step = activityChartData?.days.length > 25 ? 3 : 2;
  if (chartWidth < 1000) step = Math.ceil(activityChartData?.days.length / 10);
  if (chartWidth < 800) step = Math.ceil(activityChartData?.days.length / 7.5);
  if (chartWidth < 700) step = Math.ceil(activityChartData?.days.length / 6);

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
          labels: {
            rotation: 0,
            step,
          },
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
                return (
                  s + "<br/>" + point.series.name + ": " + point.y + " ETH"
                );
              }, "<b>" +
                this.x +
                "</b>" +
                "<br/>Sales: " +
                activityChartData.sales[index]) + "<br/>"
            );
          },
          hideDelay: 200,
          outside: false,
        },
      }}
    />
  );
});
