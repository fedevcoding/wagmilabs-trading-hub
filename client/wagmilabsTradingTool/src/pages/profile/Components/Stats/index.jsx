import { useGetHoldingNftDistribution } from "@Hooks";
import React from "react";

export const Stats = () => {
  const { loading, distribution, tokenCount } = useGetHoldingNftDistribution();

  console.log(loading, distribution, tokenCount);

  return <p>Work in progress...</p>;
};
