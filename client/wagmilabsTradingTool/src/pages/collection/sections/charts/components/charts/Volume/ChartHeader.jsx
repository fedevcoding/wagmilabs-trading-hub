import { HStack } from "@chakra-ui/react";
import React from "react";
import { rangeOptions } from "./options";

const ChartHeader = ({ range, setRange }) => {
  return (
    <HStack className="chart-header">
      <h2>Amount of volume over time.</h2>

      <select name="" id="" value={range} onChange={e => setRange(e.target.value)}>
        {rangeOptions.map(option => {
          return <option value={option.value}>{option.label}</option>;
        })}
      </select>
    </HStack>
  );
};

export default ChartHeader;
