import { HStack } from "@chakra-ui/react";
import React from "react";

const ChartHeader = () => {
  return (
    <HStack className="chart-header">
      <h2>Unique owners over time.</h2>
      <select>
        <option value="1d">1day</option>
      </select>
    </HStack>
  );
};

export default ChartHeader;
