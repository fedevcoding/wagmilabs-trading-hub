export function getTaxedTypes() {
  return [
    {
      value: "net",
      label: "Net value",
    },
    {
      value: "gross",
      label: "Gross value",
    },
  ];
}

export function getCurrencies() {
  return [
    {
      value: "eth",
      label: "ETH",
    },
    {
      value: "weth",
      label: "WETH",
    },
  ];
}
