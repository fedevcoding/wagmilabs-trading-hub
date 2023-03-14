import { getFromServer } from "@Utils";
import { useEffect, useState } from "react";

const defaultChartOptions = {
  title: {
    text: "Monthly Average Temperature",
  },
  yAxis: {
    title: {
      text: "Temperature (°C)",
    },
  },
};

export const useGetData = ({ collectionSlug }) => {
  const [chartOptions, setChartOptions] = useState(defaultChartOptions);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const owners = [...data.map(item => parseInt(item.field_type))];
  const blueChip = [...data.map(item => parseInt(item.blue_chip_rate))];

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const url = `/collectionCharts/owners?collectionSlug=${collectionSlug}&start=${"1676125081"}`;
        const data = await getFromServer(url);

        const newChartOptions = {
          title: {
            text: "Monthly Average Temperature",
          },
          yAxis: [
            {
              title: {
                text: "Primary Axis",
              },
              labels: {
                format: "{value}",
              },
            },
            {
              title: {
                text: "Secondary Axis",
              },
              opposite: true,
              labels: {
                format: "{value}",
              },
            },
          ],
          series: [
            {
              data: owners,
              yAxis: 0,
            },
            {
              data: blueChip,
              yAxis: 1,
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
