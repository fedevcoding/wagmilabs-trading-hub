import { getFromServer, roundPrice } from "@Utils";
import Highcharts from "highcharts";
import { getRange } from "./options";

import { useState, useEffect } from "react";

export const useGetData = ({ collectionAddress, range, floorPrice }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [hasNoData, setHasNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { granularity } = getRange(range);

        const data = await getFromServer(
          `/collectionCharts/advancedFloorPrice?collectionAddress=${collectionAddress}&range=${range}&granularity=${granularity}`
        );

        const maxPrice = (floorPrice / 20) * 100;
        const floorPriceData = data.filter(item => item.avg < maxPrice && item.max < maxPrice);
        const timestamps = floorPriceData.map(item => new Date(item.timestamp).toLocaleString());
        const avgs = floorPriceData.map(item => roundPrice(item.avg));
        const minMax = floorPriceData.map(item => [roundPrice(item.min), roundPrice(item.max)]);

        const newChartOptions = {
          chart: {
            backgroundColor: "transparent",
            zoomType: "x",
          },
          title: {
            text: "",
          },
          xAxis: {
            type: "datetime",
            categories: timestamps,
          },
          yAxis: {
            title: {
              text: "Price",
            },
          },
          tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: " ETH",
          },
          legend: {
            enabled: false,
          },
          series: [
            {
              name: "Average price",
              data: avgs,
              zIndex: 1,
              marker: {
                fillColor: "white",
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0],
              },
            },
            {
              name: "Max-min price",
              data: minMax,
              type: "arearange",
              linkedTo: ":previous",
              color: Highcharts.getOptions().colors[0],
              fillOpacity: 0.3,
              zIndex: 0,
              lineWidth: 1, // Set the width of the line
              linecap: "round", // Set the linecap to round to make the corners rounded
              marker: {
                enabled: false,
              },
            },
          ],
        };
        setHasNoData(false);
        setChartOptions(newChartOptions);
      } catch (error) {
        setHasNoData(true);
      }
      setLoading(false);
    };

    if (collectionAddress && range && (floorPrice ?? 0)) fetchData();
  }, [collectionAddress, range, floorPrice]);

  return { isLoading, chartOptions, hasNoData };
};
