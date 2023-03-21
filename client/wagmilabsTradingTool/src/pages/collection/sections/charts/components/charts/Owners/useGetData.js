import { getFromServer, timeInSeconds } from "@Utils";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";

const defaultChartOptions = {};

export const useGetData = ({ collectionSlug, range }) => {
  const [chartOptions, setChartOptions] = useState(defaultChartOptions);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoData, setHasNoData] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);

        const date = Math.round(Date.now() / 1000);
        const rangeInSeconds = timeInSeconds[range];
        const start = date - rangeInSeconds;

        const url = `/collectionCharts/owners?collectionSlug=${collectionSlug}&start=${start}`;
        const data = await getFromServer(url);

        const owners = data.map(item => {
          const { timestamp, field_type } = item;
          const splittedDate = timestamp.split("-");
          const formattedTimestamp = new Date(`${splittedDate[1]}-${splittedDate[0]}-${splittedDate[2]}`).getTime();
          return [formattedTimestamp, parseInt(field_type)];
        });

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
              text: "Owners",
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
              name: "Owners",
              data: owners,
              borderRadius: 10,
            },
          ],
        };

        setHasNoData(false);
        setChartOptions(newChartOptions);
      } catch (err) {
        setHasNoData(true);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (collectionSlug && range) {
      getData();
    }
  }, [collectionSlug, range]);

  return { isLoading, chartOptions, hasNoData };
};
