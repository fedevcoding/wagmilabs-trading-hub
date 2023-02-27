import React, { memo, useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts";
import { HStack, NumberInput, NumberInputField } from "@chakra-ui/react";

const columns = 25;


const defaultChartSettings = {
  title: {
    text: "Listings wall",
  },
  chart: {
    backgroundColor: "transparent",
  },
  legend: {
    enabled: false,
  },
};

const ListingChart = memo(({ floorPrice, tokensData }) => {
  const [offset, setOffset] = useState(0);

  const [chartOptions, setChartOptions] = useState(defaultChartSettings);

  useEffect(() => {
    if (floorPrice) {
      if (floorPrice < 0.005) setOffset(0.001);
      else if (floorPrice < 0.01) setOffset(0.005);
      else if (floorPrice < 0.05) setOffset(0.01);
      else if (floorPrice < 0.1) setOffset(0.01);
      else if (floorPrice < 0.1) setOffset(0.05);
      else if (floorPrice < 0.2) setOffset(0.1);
      else if (floorPrice < 0.4) setOffset(0.3);
      else if (floorPrice < 0.7) setOffset(0.5);
      else if (floorPrice < 1) setOffset(0.7);
      else if (floorPrice < 5) setOffset(1.5);
      else if (floorPrice < 10) setOffset(5);
    }
  }, [floorPrice]);

  useEffect(() => {
    if (floorPrice) {
      const numberOffset = Number(offset);

      if(numberOffset === 0) {
        setChartOptions(defaultChartSettings);
      };

      const tokens = { ...tokensData };
      const maxPrice = floorPrice + columns * numberOffset;
      Object.keys(tokens).forEach(
        key => tokens[key] >= maxPrice && delete tokens[key]
      );

      const values = Object.values(tokens);
      const min = Math.min(...values);
      const max = Math.max(...values);

      const obj = {};
      for (let i = min; i <= max; i += numberOffset) {
        let valueMin = Number(i).toFixed(2);
        let valueMax = Number.parseFloat(i + numberOffset).toFixed(2);
        obj[`${valueMin}-${valueMax}`] = 0;
      }

      values.forEach(value => {
        Object.keys(obj).forEach(key => {
          const values = key.split("-");
          const min = values[0];
          const max = values[1];

          if (value > min && value <= max) obj[key] = obj[key] + 1;
        });
      });

      const keys = Object.keys(obj);
      const chartValues = Object.values(obj);


      const newChartSettings = {
        series: [
          {
            data: chartValues,
          },
        ],
        title: {
          text: "Listings wall",
        },
        xAxis: {
          categories: keys,
        },
        chart: {
          type: "column",
          backgroundColor: "transparent",
          borderRadius: 10,
          height: "55%",
        },
        tooltip: {
          shared: true,
          formatter: function () {
            return `<b>${this.x} ETH</b><br/>${this.y} listings`;
          },
          hideDelay: 200,
          outside: false,
        },
        legend: {
          enabled: false,
        },
      };
      setChartOptions(newChartSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, tokensData]);

  return (
    <div className="listingWallChart">
      <HStack className="chart-options">
        <NumberInput value={offset} >
          <HStack>
            <NumberInputField
              placeholder="Offset"
              onChange={e =>
                setOffset(
                  e.target.value.length > 0 ? e.target.value : 0
                )
              }
            />
          </HStack>
        </NumberInput>
      </HStack>

      <HighchartsReact highcharts={HighCharts} options={chartOptions} />
    </div>
  );
});

export default ListingChart;
