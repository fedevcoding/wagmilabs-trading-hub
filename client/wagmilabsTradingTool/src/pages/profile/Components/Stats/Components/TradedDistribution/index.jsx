import React from "react";
import { Card, LoadingSpinner, Tabs } from "@Components";
import Chart from "./Chart";
import { HStack, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useFilters } from "./useFilters";

export const TradedDistribution = React.memo(({address}) => {
  const { items, loading, periods, currentPeriod, maxPrice, minPrice, setMaxPrice, setMinPrice, setPeriod } =
    useFilters(address);

  return (
    <div className="col" id="traded-distribution">
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
