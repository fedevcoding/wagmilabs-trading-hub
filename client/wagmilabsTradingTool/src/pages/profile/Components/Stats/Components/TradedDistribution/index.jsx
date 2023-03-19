import React from "react";
import { Card, LoadingSpinner, Tabs } from "@Components";
import { useGetTradedNftDistribution } from "@Hooks";
import Chart from "./Chart";
import { HStack, NumberInput, NumberInputField } from "@chakra-ui/react";

export const TradedDistribution = React.memo(() => {
  const periods = {
    "7d": 7,
    "30d": 30,
    "3M": 90,
    "1y": 365,
    all: 1800,
  };
  const [currentPeriod, setPeriod] = React.useState("30d");

  const { loading, nfts } = useGetTradedNftDistribution(periods[currentPeriod]);

  const items = nfts.map(n => ({
    ...n,
    price: n.price && n.type === "mint" ? n.price / 10 ** 18 : n.price,
  }));

  const [maxPrice, setMaxPrice] = React.useState(undefined);
  const [minPrice, setMinPrice] = React.useState(0);

  return (
    <div className="col">
      <Card>
        <div className="space-between">
          <h3>Traded Distribution</h3>
          <HStack gap="10px">
            <HStack>
              <label>Min price: </label>
              <NumberInput min={0} value={minPrice || 0}>
                <NumberInputField width={50} onChange={e => setMinPrice(e.target.value)} />
              </NumberInput>
            </HStack>

            <HStack>
              <label>Max price: </label>
              <NumberInput min={0} value={maxPrice}>
                <NumberInputField width={50} onChange={e => setMaxPrice(e.target.value)} />
              </NumberInput>
            </HStack>
          </HStack>
          <Tabs tabs={Object.keys(periods)} active={currentPeriod} setTab={value => setPeriod(value)} />
        </div>
        {(loading && <LoadingSpinner />) || (
          <Chart
            data={items.filter(
              i =>
                ((maxPrice !== undefined && i.price <= maxPrice) || maxPrice === undefined) &&
                i.price >= (minPrice || 0)
            )}
          />
        )}
      </Card>
    </div>
  );
});
