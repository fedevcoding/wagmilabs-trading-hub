import React from "react";
import { getCurrencies, getTaxedTypes } from "./functions";

export function useSettings() {
  const taxedTypes = getTaxedTypes();
  const currencies = getCurrencies();
  const [taxedOn, setTaxedOn] = React.useState(taxedTypes[0]);
  const [currency, setCurrency] = React.useState(currencies[0]);
  const [taxPerc, setTaxPerc] = React.useState(26);
  const [taxLossHarvesting, setTaxLossHarvesting] = React.useState(true);
  const [longTermTax, setLongTermTax] = React.useState(undefined);

  return {
    taxedOn,
    currency,
    taxPerc,
    setTaxedOn,
    setCurrency,
    setTaxPerc,
    currencies,
    taxedTypes,
    taxLossHarvesting,
    setTaxLossHarvesting,
    longTermTax,
    setLongTermTax,
  };
}
