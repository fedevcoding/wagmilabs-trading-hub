import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DarkUnica from "highcharts/themes/dark-unica";

DarkUnica(Highcharts);

export const PieChart = ({ items, title, countElements }) => {
  const [margin, setMargin] = React.useState(80);

  React.useLayoutEffect(() => {
    const elemHighcharts = document.querySelector(".highcharts-background");
    if (elemHighcharts) {
      const widthContainer = elemHighcharts.getBoundingClientRect().width;
      const plotWidth = document.querySelector(".highcharts-plot-background").getBoundingClientRect().width;
      setMargin(parseInt((widthContainer - plotWidth) / 2) - 12);
    }
  }, []);

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
      x: margin,
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
        const percentage = (this.y / countElements) * 100;
        const text = `${this.name}: ${percentage.toFixed(1)}%`;

        return `<span class="legend-row" title="${text}">${text}</span>`;
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
