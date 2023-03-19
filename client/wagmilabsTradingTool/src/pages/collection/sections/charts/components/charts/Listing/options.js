export const rangeOptions = [
  { value: "1d", label: "1 day" },
  { value: "3d", label: "3 days" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "1 month" },
  { value: "90d", label: "3 months" },
];

export const getRange = rangeValue => {
  const range = rangeOptions.find(item => item.value === rangeValue);

  return range;
};
