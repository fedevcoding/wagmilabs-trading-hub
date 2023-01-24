import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DarkUnica from "highcharts/themes/dark-unica";

import "./style.css";

DarkUnica(Highcharts);

export const BarChart = ({
  title,
  subTitle,
  values,
  yAxisText = "",
  tooltipSuffix = undefined,
}) => (
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
        tooltip: {
          valueSuffix: tooltipSuffix,
          formatter: function () {
            const dollarValue = (values?.secondValue || [])[this.point.index];
            return dollarValue
              ? this.y + ` ${tooltipSuffix}<br>$` + dollarValue
              : this.y + tooltipSuffix;
          },
        },
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
          },
        ],
      }}
    />
  </div>
);
