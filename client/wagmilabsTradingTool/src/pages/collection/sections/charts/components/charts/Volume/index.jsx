import React, { useState } from "react";
import { selectOptions } from "./options";

export function VolumeChart() {
  const [granularity, setGranularity] = useState("1d");
  const [range, setRange] = useState(selectOptions[granularity]);

  return (
    <div>
      <select name="" id="">
        {selectOptions.map(option => {
          return <option>{option.label}</option>;
        })}
      </select>
    </div>
  );
}
