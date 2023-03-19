import { getFromServer } from "@Utils";
import Highcharts from "highcharts";

const { useState, useEffect } = require("react");

export const useGetData = ({ range, collectionAddress }) => {
  const [isLoading, setLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState({});
  const [hasNoData, setHasNoData] = useState(false);
  const [chartType, setChartType] = useState("spline");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `/collectionCharts/listings?collectionAddress=${collectionAddress}&range=${range}`;
        const listingsData = await getFromServer(url);

        setData(listingsData);
        setHasNoData(false);
      } catch (error) {
        setHasNoData(true);
      } finally {
        setLoading(false);
      }
    };

    if (collectionAddress && range) {
      fetchData();
    }
  }, [collectionAddress, range]);

  useEffect(() => {
    const todayListings = data.map(item => [new Date(item.processedAt).getTime(), item.todayListed]);

    const newChartOptions = {
      chart: {
        type: chartType,
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
      series: [
        {
          name: "Daily listings",
          data: todayListings,
          borderRadius: 10,
        },
      ],
    };

    if (chartType === "spline") {
      const totalListings = data.map(item => [new Date(item.processedAt).getTime(), item.totalListed]);

      newChartOptions.series.push({
        name: "Total listings",
        data: totalListings,
        borderRadius: 10,
      });
    } else if (chartType === "area") {
      newChartOptions.plotOptions = {
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
      };
    }

    setChartOptions(newChartOptions);
  }, [data, chartType]);

  return { isLoading, chartOptions, hasNoData, chartType, setChartType };
};
