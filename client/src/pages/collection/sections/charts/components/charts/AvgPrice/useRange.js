import { useState } from "react";
import { rangeOptions } from "./options";

const defaultTimeframeIndex = 4;

export const useRange = () => {
  const [range, setRange] = useState(rangeOptions[defaultTimeframeIndex].value);

  return { range, setRange };
};
