import React, { memo, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts";
import HC_more from "highcharts/highcharts-more";
import {
  HStack,
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/react";
import { useRefreshSecond } from "@Hooks";
import { roundPrice } from "@Utils";

const ComparisonChart = memo(({ totalListings, totalSales, floorPrice }) => {
  HC_more(HighCharts);

  const [chartType, setChartType] = React.useState("column");

  const [maxPrice, setMaxPrice] = React.useState(
    floorPrice + (floorPrice / 100) * 20
  );
  const [minPrice] = React.useState(0);

  const [time, setTime] = React.useState(300000);

  const [chartOptions, setChartOptions] = React.useState({});
  const refresh = useRefreshSecond()
  

  useEffect(()=>{
    floorPrice && setMaxPrice(floorPrice + (floorPrice / 100) * 20)
  }, [floorPrice])

  useEffect(() => {
    const timeframe = Date.now() - time;
    const numberMaxPrice = Number(maxPrice);
    const rightSales = totalSales.filter(
      sale =>
        sale.value < numberMaxPrice &&
        sale.value > minPrice &&
        sale.timestamp >= timeframe
    ).length;
    const rightListings = totalListings.filter(
      listing =>
        listing.value < numberMaxPrice &&
        listing.value > minPrice &&
        listing.timestamp * 1000 >= timeframe
    ).length;

    const chartOptions1 = {
      chart: {
        type: "bubble",
        plotBorderWidth: 1,
        height: "55%",
      },
      title: {
        text: "Listings vs Sales",
      },
      tooltip: {

        formatter : function() {
          return `<div>${this.point.z} ${this.series.name}</div>`;
        },

      },
      series: [
        {
          name: "Listings",
          data: [[0, 0, rightListings]],
        },
        {
          name: "Sales",
          data: [[1, 0, rightSales]],
        },
      ],
      legend: {
        enabled: false,
      },
    };

    const chartOptions2 = {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: "55%",
      },
      title: {
        text: "Listings vs Sales",
      },
      yAxis: {
        text: "",
      },
      series: [
        {
          name: "Listings",
          data: [rightListings],
        },
        {
          name: "Sales",
          data: [rightSales],
        },
      ],
      legend: {
        enabled: false,
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return `<div>${this.point.y} ${this.series.name}</div>`;
        },
        followPointer: true,
      }
    };

    setChartOptions(chartType === "bubble" ? chartOptions1 : chartOptions2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalListings, totalSales, time, chartType, maxPrice, refresh]);

  return (
    <div className="sale-list-comparison-chart">
      <div className="options-container">
        <HStack>
          <Select
            onChange={e => setTime(e.target.value)}
            color="white"
            colorScheme={"white"}
            defaultValue={300000}
          >
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
            <option value={600000}>10 minutes</option>
          </Select>
        </HStack>

        <NumberInput value={roundPrice(maxPrice)}>
          <HStack>
            <NumberInputField
              placeholder="Max price (ETH)"
              onChange={e =>
                setMaxPrice(e.target.value)
              }
            />
          </HStack>
        </NumberInput>

        <div className="chart-type-selector">
          <i
            className={`fa-solid fa-chart-simple ${
              chartType === "column" && "selected"
            }`}
            onClick={() => setChartType("column")}
          ></i>
          <i
            className={`fa-sharp fa-solid fa-chart-scatter-bubble ${
              chartType === "bubble" && "selected"
            }`}
            onClick={() => setChartType("bubble")}
          ></i>
        </div>
      </div>

      <HighchartsReact highcharts={HighCharts} options={chartOptions} />
    </div>
  );
});

export default ComparisonChart;
