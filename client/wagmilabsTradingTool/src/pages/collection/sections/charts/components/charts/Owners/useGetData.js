import { getFromServer } from "@Utils";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const defaultChartOptions = {};

export const useGetData = ({ collectionSlug }) => {
  const [chartOptions, setChartOptions] = useState(defaultChartOptions);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const url = `/collectionCharts/owners?collectionSlug=${collectionSlug}&start=${"1676125081"}`;
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

        setChartOptions(newChartOptions);

        setData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [collectionSlug]);

  return { data, isLoading, chartOptions };
};
