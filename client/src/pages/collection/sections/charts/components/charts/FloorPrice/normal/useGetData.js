import { getFromServer, roundPrice } from "@Utils";
import Highcharts from "highcharts";

import { useState, useEffect } from "react";

export const useGetData = ({ collectionAddress, range }) => {
  // const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const floorPriceData = await getFromServer(
          `/collectionCharts/floorPrice?collectionAddress=${collectionAddress}&range=${range}`
        );

        if (!floorPriceData.length || !floorPriceData) {
          setHasNoData(true);
          return;
        }

        const floorPrice = floorPriceData.map(item => [item[0] * 1000, roundPrice(item[2])]);

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
              text: "Floor price",
            },
          },
          legend: {
            enabled: false,
          },
          tooltip: {
            enabled: true,
            valueSuffix: " ETH",
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
              name: "Floor price",
              data: floorPrice,
              borderRadius: 10,
            },
          ],
        };
        setHasNoData(false);

        setChartOptions(newChartOptions);
      } catch (error) {
        setHasNoData(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionAddress, range]);

  return { isLoading, chartOptions, hasNoData };
};
