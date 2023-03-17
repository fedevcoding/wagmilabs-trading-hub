import { getFromServer, roundPrice } from "@Utils";
import Highcharts from "highcharts";

const { useState, useEffect } = require("react");

export const useGetData = ({ collectionAddress, range }) => {
  // const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getFromServer(`/collectionCharts/advancedFloorPrice?collectionAddress=${collectionAddress}`);

        const realValues = data.filter(item => item.avg !== "" && item.max !== "" && item.min !== "");

        const avgSum = realValues.reduce((acc, item) => acc + parseFloat(item?.avg || 0), 0);
        const averageOfAvg = avgSum / realValues.length || 0;

        alert(averageOfAvg);

        const floorPriceData = data.filter(
          item => parseFloat(item.avg) < averageOfAvg * 1.5 && parseFloat(item.max) < averageOfAvg * 1.5
        );

        const timestamps = floorPriceData.map(item => new Date(item.timestamp).toLocaleString());
        const avgs = floorPriceData.map(item => roundPrice(parseFloat(item.avg)));
        const minMax = floorPriceData.map(item => [roundPrice(parseFloat(item.min)), roundPrice(parseFloat(item.max))]);

        // const newChartOptions = {
        //   chart: {
        //     type: "spline",
        //     zoomType: "x",
        //     backgroundColor: "transparent",
        //   },
        //   title: {
        //     text: "",
        //     align: "left",
        //   },
        //   xAxis: {
        //     type: "datetime",
        //   },
        //   yAxis: {
        //     title: {
        //       text: "Floor price",
        //     },
        //   },
        //   legend: {
        //     enabled: false,
        //   },
        //   tooltip: {
        //     enabled: true,
        //     valueSuffix: " ETH",
        //   },
        //   series: [
        //     {
        //       name: "Floor price",
        //       data: mins,
        //       borderRadius: 10,
        //     },
        //     {
        //       name: "Floor price",
        //       data: avgs,
        //       borderRadius: 10,
        //     },
        //     {
        //       name: "Floor price",
        //       data: maxs,
        //       borderRadius: 10,
        //     },
        //   ],
        // };

        const newChartOptions = {
          chart: {
            backgroundColor: "transparent",
          },
          title: {
            text: "",
          },
          xAxis: {
            type: "datetime",
            categories: timestamps,
            // accessibility: {
            //   rangeDescription: "Range: Jul 1st 2022 to Jul 31st 2022.",
            // },
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

          // plotOptions: {
          //   series: {
          //     pointStart: Date.UTC(2022, 6, 1),
          //     pointIntervalUnit: "day",
          //   },
          // },

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

        setChartOptions(newChartOptions);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [collectionAddress, range]);

  return { isLoading, chartOptions };
};
