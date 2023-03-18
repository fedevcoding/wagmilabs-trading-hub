import { getFromServer, timeInSeconds } from "@Utils";
import { useEffect, useState } from "react";
import { rangeOptions } from "./options";

export const useGetData = (collectionAddress, range) => {
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);

        const rangeInSeconds = timeInSeconds[range];
        const granularity = rangeOptions.find(item => item.value === range).granularity;
        const granularityInSeconds = timeInSeconds[granularity];

        const url = `/collectionCharts/buyersSellers?collectionAddress=${collectionAddress}&range=${rangeInSeconds}&granularity=${granularityInSeconds}`;
        const data = await getFromServer(url);

        const buyers = data.map(item => [new Date(item.tx_timestamp).getTime(), item.buyers]);
        const sellers = data.map(item => [new Date(item.tx_timestamp).getTime(), item.sellers]);

        const newChartOptions = {
          chart: {
            type: "column",
            zoomType: "x",
            backgroundColor: "transparent",
          },

          title: {
            text: "",
          },
          legend: {
            enabled: false,
          },
          xAxis: {
            type: "datetime",
            crosshair: true,
          },
          yAxis: {
            title: {
              text: "Amount",
            },
          },
          tooltip: {
            shared: true,
            followPointer: true,
          },

          series: [
            {
              name: "Buyers",
              data: buyers,
              borderRadius: 3,
            },
            {
              name: "Sellers",
              data: sellers,
              borderRadius: 3,
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
    if (collectionAddress && range) {
      getData();
    }
  }, [collectionAddress, range]);

  return { isLoading, chartOptions };
};
