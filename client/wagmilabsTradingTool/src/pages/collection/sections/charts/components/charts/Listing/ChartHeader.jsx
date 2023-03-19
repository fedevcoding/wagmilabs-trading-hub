import { HStack } from "@chakra-ui/react";
import { Select } from "@Components";
import React from "react";
import { ChartSelector } from "src/components/ChartSelector";
import { rangeOptions, getRange } from "./options";

const ChartHeader = ({ range, setRange, chartType, setChartType }) => {
  return (
    <HStack className="chart-header">
      <h2>Collection listings over time.</h2>

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
            onChange={chart => setChartType(chart)}
            chart1Type={"spline"}
            chart2Type={"area"}
            chartType={chartType}
          />
        </HStack>
      </HStack>
    </HStack>
  );
};

export default ChartHeader;
