import { getFromServer, timeInSeconds } from "@Utils";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { rangeOptions } from "./options";

export const useGetData = (collectionAddress, range) => {
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoData, setHasNoData] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);

        const rangeInSeconds = timeInSeconds[range];
        const granularity = rangeOptions.find(item => item.value === range).granularity;
        const granularityInSeconds = timeInSeconds[granularity];

        const url = `/collectionCharts/sales?collectionAddress=${collectionAddress}&range=${rangeInSeconds}&granularity=${granularityInSeconds}`;
        const salesData = await getFromServer(url);

        const sales = salesData.map(item => [new Date(item.tx_timestamp).getTime(), item.sales]);

        const newChartOptions = {
          chart: {
            type: "area",
            zoomType: "x",
            backgroundColor: "transparent",
          },
          title: {
            text: "",
            align: "left",
          },
          xAxis: {
            type: "datetime",
          },
          yAxis: {
            title: {
              text: "Sales",
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            area: {
              borderRadius: 10,
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")],
                ],
              },
              marker: {
                radius: 2,
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1,
                },
              },
              threshold: null,
            },
          },

          series: [
            {
              type: "area",
              name: "Sales",
              data: sales,
              borderRadius: 10,
            },
          ],
        };
        setHasNoData(false);
        setChartOptions(newChartOptions);
      } catch (error) {
        setHasNoData(true);
      } finally {
        setIsLoading(false);
      }
    }
    if (collectionAddress && range) {
      getData();
    }
  }, [collectionAddress, range]);

  return { isLoading, chartOptions, hasNoData };
};
