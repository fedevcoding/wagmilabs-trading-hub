import React from "react";
import { getCurrencies, getTaxedTypes } from "./functions";

export function useSettings() {
  const taxedTypes = getTaxedTypes();
  const currencies = getCurrencies();

  const settings = JSON.parse(localStorage.getItem("profitandloss-settings") || "{}").data;

  const [taxedOn, setTaxedOn] = React.useState(settings?.taxedOn || taxedTypes[0]);
  const [currency, setCurrency] = React.useState(settings?.currency || currencies[0]);
  const [taxPerc, setTaxPerc] = React.useState(settings?.taxPerc || 26);
  const [taxLossHarvesting, setTaxLossHarvesting] = React.useState(
    settings?.taxLossHarvesting === false ? false : true
  );
  const [longTermTax, setLongTermTax] = React.useState(settings?.longTermTax);

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
