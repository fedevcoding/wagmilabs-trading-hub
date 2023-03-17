import { useState } from "react";
import { rangeOptions } from "./options";

const defaultTimeframeIndex = 5;

export const useRange = () => {
  const [range, setRange] = useState(rangeOptions[defaultTimeframeIndex].value);

  return { setRange, range };
};
