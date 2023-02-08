import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DarkUnica from "highcharts/themes/dark-unica";
import getMarketplaceImage from "../../../utils/marketplaceImageMapping";

import "./style.css";

DarkUnica(Highcharts);

export const OrizontalBarChart = ({
  title,
  subTitle,
  values,
  yAxisText = "",
  tooltipSuffix = undefined,
  useMarketImg = false,
}) => (
  <div className="bar-chart">
        <HighchartsReact
      className="chart"
      highcharts={Highcharts}
      options={{
        chart: {
          type: "bar",
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
          ...(useMarketImg
            ? {
                labels: {
                  useHTML: true,
                  formatter: function (e) {
                    const marketplace = e.value;
                    const marketplaceImg = getMarketplaceImage(marketplace);
                    return `
                <div class="market-img">
                  <img src="${marketplaceImg}" width="17px" />
                  ${marketplace}
                </div>
              `;
                  },
                },
              }
            : {}),
          title: {
            text: null,
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: yAxisText,
            align: "high",
          },
          labels: {
            overflow: "justify",
          },
        },
        tooltip: {
          valueSuffix: tooltipSuffix,
          formatter: function () {
            return this.point.secondValue
              ? this.y + " ETH<br>$" + this.point.secondValue
              : this.y + tooltipSuffix;
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
            },
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
