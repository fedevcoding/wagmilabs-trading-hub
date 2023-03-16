import { LoadingSpinner } from "@Components";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import React, { useState } from "react";
import { selectOptions } from "./options";
import { useGetData } from "./useGetData";
import ChartHeader from "./ChartHeader";

export function VolumeChart({ collectionAddress }) {
  // const [granularity, setGranularity] = useState("1d");
  // const [range, setRange] = useState(selectOptions[granularity]);

  const { chartOptions, isLoading } = useGetData(collectionAddress);

  return (
    <div className="volume-chart-section">
      {/* <select name="" id="">
        {selectOptions.map(option => {
          return <option>{option.label}</option>;
        })}
      </select> */}
      <ChartHeader />
      {isLoading ? <LoadingSpinner /> : <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
    </div>
  );
}
