import { getFromServer } from "@Utils";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";

export const useGetData = collectionAddress => {
  //   const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);

        const url = `/collectionCharts/volume?collectionAddress=${collectionAddress}`;
        const volumeData = await getFromServer(url);

        const volume = volumeData.map(item => [new Date(item.tx_timestamp).getTime(), item.volume]);

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
              text: "Volume",
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
              name: "Volume",
              data: volume,
              borderRadius: 10,
            },
          ],
        };

        setChartOptions(newChartOptions);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (collectionAddress) {
      getData();
    }
  }, [collectionAddress]);

  return { isLoading, chartOptions };
};
