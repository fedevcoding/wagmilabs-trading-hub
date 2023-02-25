import React, { memo, useEffect, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts";
import { HStack, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useMemo } from "react";

const BubbleChart = memo(({ totalListings, totalSales, floorPrice }) => {
  const [maxPrice, setMaxPrice] = React.useState(0);
  const [minPrice, setMinPrice] = React.useState(0);

  const chartRef = useRef();

  useEffect(() => {
    if (floorPrice < 0.005) setMaxPrice(0.04);
    else if (floorPrice < 0.01) setMaxPrice(0.08);
    else if (floorPrice < 0.05) setMaxPrice(0.2);
    else if (floorPrice < 0.1) setMaxPrice(0.4);
    else if (floorPrice < 0.2) setMaxPrice(0.5);
    else if (floorPrice < 0.4) setMaxPrice(0.7);
    else if (floorPrice < 0.7) setMaxPrice(1.1);
    else if (floorPrice < 1) setMaxPrice(1.4);
    else if (floorPrice < 5) setMaxPrice(8);
    else if (floorPrice < 10) setMaxPrice(18);
    const minValue = Math.min(
      ...totalListings?.map(listing => listing.value),
      ...totalSales?.map(sale => sale.value)
    );

    setMinPrice(minValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorPrice]);

  const listingData = useMemo(
    () =>
      totalListings?.map(listing => {
        const { value, timestamp, name, image, tokenId, marketplace } = listing;
        const realTimestamp = timestamp * 1000;

        let newObject = {};
        if (value < maxPrice && value > minPrice) {
          newObject = {
            x: realTimestamp,
            y: value,
            name: name || tokenId,
            image: image,
            tokenId: tokenId,
            marketplace: marketplace,
            readableDate: new Date(realTimestamp).toDateString(),
          };
        }
        return newObject;
      }),
    [totalListings, maxPrice, minPrice]
  );

  const salesData = useMemo(
    () =>
      totalSales?.map(sale => {
        const { value, timestamp, name, image, tokenId, marketplace } = sale;

        let newObject = {};
        if (value < maxPrice && value > minPrice) {
          newObject = {
            x: timestamp,
            y: value,
            name: name || tokenId,
            image: image,
            tokenId: tokenId,
            marketplace: marketplace,
            readableDate: new Date(timestamp).toDateString(),
          };
        }
        return newObject;
      }),
    [totalSales, maxPrice, minPrice]
  );

  useEffect(() => {
    if (salesData && listingData) {
      const chart = chartRef.current.chart;
      chart.series[0].setData(salesData);
      chart.series[1].setData(listingData);
    }
  }, [maxPrice, minPrice, salesData, listingData]);

  const minTimestamp = useMemo(
    () =>
      Math.min(
        ...totalListings?.map(listing => listing.timestamp * 1000),
        ...totalSales?.map(sale => sale.timestamp)
      ),
    [totalListings, totalSales]
  );
  const maxTimestamp = useMemo(
    () =>
      Math.max(
        ...totalListings?.map(listing => listing.timestamp * 1000),
        ...totalSales?.map(sale => sale.timestamp)
      ),
    [totalListings, totalSales]
  );

  const chartOptions = {
    series: [
      {
        type: "scatter",
        name: "Sales",
        turboThreshold: 2500,
        data: salesData,
        zIndex: 2,
        tooltip: {
          pointFormat: `
                    <div>
                        <p>{point.readableDate}</p>
                        <p>Sale of {point.name}</p>
                        <p>Price: {point.y} ETH</p>
                        <p>Marketplace: {point.marketplace}</p>
                        <p>Token ID: {point.tokenId}</p>
                        <img class="bubble-chart-image" src={point.image} style={{width: 50px, height: 50px}} />
                    </div>
                    `,
        },
        marker: {
          fillColor: "red",
          lineColor: "#FFFFFF",
          zIndex: 100,
        },
      },
      {
        type: "scatter",
        name: "Listings",
        data: listingData,
        zIndex: 1,
        turboThreshold: 2500,
        tooltip: {
          pointFormat: `
                    <div>
                        <p>{point.readableDate}</p>
                        <p>Listing of {point.name}</p>
                        <p>Price: {point.y} ETH</p>
                        <p>Marketplace: {point.marketplace}</p>
                        <p>Token ID: {point.tokenId}</p>
                        <img class="bubble-chart-image" src={point.image} style={{width: 50px, height: 50px}} />
                    </div>
                    `,
        },
        marker: {
          fillColor: "orange",
          lineColor: "#FFFFFF",
        },
      },
    ],
    plotOptions: {
      series: {
        marker: {
          symbol: "circle",
          radius: 4,
        },
      },
    },
    title: {
      text: "Sales and Listings",
    },
    xAxis: {
      type: "datetime",
      min: minTimestamp,
      max: maxTimestamp,
    },
    yAxis: {
      title: {
        text: "Price (ETH)",
      },
    },
    chart: {
      backgroundColor: "transparent",
      borderRadius: 10,
    },
    tooltip: {
      useHTML: true,
    },
  };

  return (
    <div className="bubble-chart">
      <div className="chart-options">
        <HStack gap={"30px"}>

          <HStack>
            <label>Min price: </label>
            <NumberInput value={minPrice}>
              <HStack>
                <NumberInputField
                  onChange={e => setMinPrice(e.target.value)}
                  defaultValue={floorPrice}
                  value={floorPrice}
                />
              </HStack>
            </NumberInput>
          </HStack>

          <HStack>
            <label>Max price: </label>
            <NumberInput value={maxPrice}>

              <HStack>
                <NumberInputField
                  onChange={e => setMaxPrice(e.target.value)}
                  defaultValue={maxPrice}
                />
              </HStack>
            </NumberInput>
          </HStack>

          <HStack>
            <i className="fa-regular fa-triangle-exclamation little-text low-opacity"></i>
            <p className="little-text low-opacity">Sales and Listings are limited to 2000 results</p>
          </HStack>

        </HStack>
      </div>

      <HighchartsReact
        highcharts={HighCharts}
        options={chartOptions}
        ref={chartRef}
      />
    </div>
  );
});

export default BubbleChart;
