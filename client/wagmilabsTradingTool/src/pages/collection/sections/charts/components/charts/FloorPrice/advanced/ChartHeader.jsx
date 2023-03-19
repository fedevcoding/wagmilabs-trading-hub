import { HStack } from "@chakra-ui/react";
import { Select } from "@Components";
import React from "react";
import { ChartSelector } from "src/components/ChartSelector";
import { rangeOptions, getRange } from "./options";

const ChartHeader = ({ range, setRange, handleChartType }) => {
  return (
    <HStack className="chart-header">
      <h2>Collection floor price over time.</h2>

      <HStack gap={"20px"}>
        <HStack gap={"10px"}>
          <p>Period:</p>
          <Select
            options={rangeOptions}
            value={getRange(range)}
            onChange={d => setRange(d.value)}
            isSearchable={false}
          />
        </HStack>

        <HStack>
          <ChartSelector
            onChange={() => handleChartType("normal")}
            chart1Type={"line"}
            chart2Type={"advanced"}
            chartType={"advanced"}
          />
        </HStack>
      </HStack>
    </HStack>
  );
};

export default ChartHeader;
