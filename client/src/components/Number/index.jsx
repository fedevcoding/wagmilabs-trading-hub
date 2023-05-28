import React from "react";
import { roundPrice, roundPriceUsd } from "@Utils";

import "./style.scss";

export const Number = ({ n, crypto = true, symbol = "" }) => {
  const valueToCheck = crypto ? roundPrice(n) : Math.round((n || 0) * 100) / 100;
  const className = valueToCheck > 0 ? "positive" : "neutral";

  return (
    <span className={"number " + (valueToCheck < 0 ? "negative" : className)}>
      {crypto ? roundPrice(n) : roundPriceUsd(n)}
      {symbol}
    </span>
  );
};
