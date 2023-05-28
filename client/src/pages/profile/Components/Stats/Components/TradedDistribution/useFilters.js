import { useGetTradedNftDistribution } from "@Hooks";
import React from "react";

export function useFilters(address) {
  const periods = {
    "7d": 7,
    "30d": 30,
    "3M": 90,
    "1y": 365,
    all: 1800,
  };
  const [currentPeriod, setPeriod] = React.useState("30d");

  const { loading, nfts } = useGetTradedNftDistribution(address, periods[currentPeriod]);

  const items = (nfts || []).map(n => ({
    ...n,
    price: n.price && n.type === "mint" ? n.price / 10 ** 18 : n.price,
  }));

  const [maxPrice, setMaxPrice] = React.useState(undefined);
  const [minPrice, setMinPrice] = React.useState(0);

  return {
    items,
    loading,
    periods,
    currentPeriod,
    maxPrice,
    minPrice,
    setMaxPrice,
    setMinPrice,
    setPeriod,
  };
}
