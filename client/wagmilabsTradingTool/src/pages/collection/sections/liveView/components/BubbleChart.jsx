import React, { memo, useEffect, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts";
import { HStack, NumberInput, NumberInputField, Select } from "@chakra-ui/react";

const dateOptions = {
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const BubbleChart = memo(({ totalListings, totalSales, floorPrice }) => {
  const [maxPrice, setMaxPrice] = React.useState(0);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxTime, setMaxTime] = React.useState(21600000);

  const [chartOptions, setChartOptions] = React.useState({});

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
    const minValue = Math.min(...totalListings?.map(listing => listing.value), ...totalSales?.map(sale => sale.value));

    setMinPrice(minValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorPrice]);

  useEffect(() => {
    const listingData = totalListings
      ?.map(listing => {
        const { value, timestamp, name, image, tokenId, marketplace, ms } = listing;
        const realTimestamp = ms ? timestamp : timestamp * 1000;

        const rightTime = Date.now() - maxTime;

        let newObject = {};
        if (value < maxPrice && value > minPrice && realTimestamp >= rightTime) {
          newObject = {
            x: realTimestamp,
            y: value,
            name: name || tokenId,
            image: image,
            tokenId: tokenId,
            marketplace: marketplace,
            readableDate: new Date(realTimestamp).toLocaleString("en-US", dateOptions),
          };
        }
        return newObject;
      })
      .filter(listing => listing.x !== undefined);

    const salesData = totalSales
      ?.map(sale => {
        const { value, timestamp, name, image, tokenId, marketplace } = sale;
        const rightTime = Date.now() - maxTime;
        let newObject = {};
        if (value < maxPrice && value > minPrice && timestamp >= rightTime) {
          newObject = {
            x: timestamp,
            y: value,
            name: name || tokenId,
            image: image,
            tokenId: tokenId,
            marketplace: marketplace,
            readableDate: new Date(timestamp).toLocaleString("en-US", dateOptions),
          };
        }
        return newObject;
      })
      .filter(listing => listing.x !== undefined);

    const minTimestamp = Math.min(...listingData?.map(listing => listing.x), ...salesData?.map(sale => sale.x));
    const maxTimestamp = Math.max(...listingData?.map(listing => listing.x), ...salesData?.map(sale => sale.x));

    const chartObject = {
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

    salesData && listingData && setChartOptions(chartObject);
  }, [maxPrice, minPrice, maxTime, floorPrice, totalListings, totalSales]);

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
                <NumberInputField onChange={e => setMaxPrice(e.target.value)} defaultValue={maxPrice} />
              </HStack>
            </NumberInput>
          </HStack>

          <HStack>
            <Select
              onChange={e => setMaxTime(e.target.value)}
              color="white"
              colorScheme={"white"}
              defaultValue={21600000}
            >
              <option value={300000}>5 minutes</option>
              <option value={1800000}>30 minutes</option>
              <option value={7200000}>2 hours</option>
              <option value={21600000}>6 hours</option>
              <option value={86400000}>1 day</option>
              <option value={259200000}>3 days</option>
              <option value={604800000}>7 days</option>
            </Select>
          </HStack>

          <HStack>
            <i className="fa-regular fa-triangle-exclamation little-text low-opacity"></i>
            <p className="little-text low-opacity">Sales and Listings are limited to 2000 results</p>
          </HStack>
        </HStack>
      </div>

      <HighchartsReact highcharts={HighCharts} options={chartOptions} ref={chartRef} />
    </div>
  );
});

export default BubbleChart;
