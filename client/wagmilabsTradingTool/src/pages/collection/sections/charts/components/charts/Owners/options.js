export const rangeOptions = [
  { value: "2h", label: "2 hours" },
  { value: "6h", label: "6 hours" },
  { value: "12h", label: "12 hours" },
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
  { value: "1M", label: "1 month" },
  { value: "6M", label: "6 months" },
  { value: "1y", label: "1 year" },
  { value: "all", label: "All time" },
];

export const getRange = rangeValue => {
  const range = rangeOptions.find(item => item.value === rangeValue);

  return range;
};
