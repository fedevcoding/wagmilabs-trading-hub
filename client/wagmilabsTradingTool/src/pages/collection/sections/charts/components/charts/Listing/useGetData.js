import { getFromServer } from "@Utils";
import Highcharts from "highcharts";

const { useState, useEffect } = require("react");

export const useGetData = ({ range, collectionAddress }) => {
  // const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `/collectionCharts/listings?collectionAddress=${collectionAddress}&range=${range}`;
        const listingsData = await getFromServer(url);

        const listings = listingsData.map(item => [new Date(item.processedAt).getTime(), item.todayListed]);

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
              text: "Listings",
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
              name: "Listings",
              data: listings,
              borderRadius: 10,
            },
          ],
        };

        setChartOptions(newChartOptions);

        // setData(listingsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (collectionAddress && range) {
      fetchData();
    }
  }, [collectionAddress, range]);

  return { isLoading, chartOptions };
};
