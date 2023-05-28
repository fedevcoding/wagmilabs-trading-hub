export const rangeOptions = [
  { value: "1_DAY", label: "1 day", granularity: "1_HOUR" },
  { value: "7_DAYS", label: "7 days", granularity: "1_DAY" },
  { value: "30_DAYS", label: "30 days", granularity: "1_DAY" },
  { value: "365_DAYS", label: "1 year", granularity: "1_DAY" },
];

export const getRange = rangeValue => {
  const range = rangeOptions.find(item => item.value === rangeValue);

  return range;
};
