import { HStack } from "@chakra-ui/react";
import { Select } from "@Components";
import React from "react";
import { rangeOptions, getRange } from "./options";

const ChartHeader = ({ range, setRange }) => {
  return (
    <HStack className="chart-header">
      <h2>Average floor price over time.</h2>

      <Select options={rangeOptions} value={getRange(range)} onChange={d => setRange(d.value)} isSearchable={false} />
    </HStack>
  );
};

export default ChartHeader;
