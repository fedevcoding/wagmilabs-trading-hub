export const rangeOptions = [
  { value: "24h", label: "1 day" },
  { value: "1w", label: "7 days" },
  { value: "1m", label: "30 days" },
  { value: "3m", label: "3 months" },
  { value: "6m", label: "6 months" },
  { value: "1y", label: "1 year" },
];

export const getRange = rangeValue => {
  const range = rangeOptions.find(item => item.value === rangeValue);

  return range;
};
