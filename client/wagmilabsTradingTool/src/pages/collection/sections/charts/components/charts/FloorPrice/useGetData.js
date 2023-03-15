import { getFromServer } from "@Utils";
import { createChart } from "lightweight-charts";

const { useState, useEffect } = require("react");

export const useGetData = ({ collectionAddress }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { response: data } = await getFromServer(
          `/collectionCharts/floorPrice?collectionAddress=${collectionAddress}&startDate=${"2023-01-01"}`
        );

        const chartData = data.map(item => ({
          time: new Date(item.timestamp).toISOString().slice(0, 10),
          open: item?.open?.price,
          high: item?.high?.price,
          low: item?.floor?.price,
          close: item?.close?.price,
        }));

        console.log(chartData);
        const chartOptions = { layout: { textColor: "black", background: { type: "solid", color: "white" } } };
        const chart = createChart(document.getElementById("twFloorChart"), chartOptions);
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });
        candlestickSeries.setData(chartData);

        chart.timeScale().fitContent();
        setData(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, [collectionAddress]);

  return { data, error, loading };
};
