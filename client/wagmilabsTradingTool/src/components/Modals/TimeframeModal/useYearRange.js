import React from "react";

export function useYearRange() {
  const currentYear = new Date().getFullYear();
  const years = [
    {
      label: currentYear,
      value: currentYear,
      startDate: new Date(currentYear, 0, 1).getTime(),
      endDate: new Date().getTime(),
    },
  ];
  for (let i = 0, year = currentYear; i < 3; i++, year--) {
    years.push({
      label: year - 1,
      value: year - 1,
      startDate: new Date(year - 1, 0, 1).getTime(),
      endDate: new Date(year, 0, 1).getTime(),
    });
  }

  const [rangeYear, setRangeYear] = React.useState(years[0]);

  return {
    years,
    rangeYear,
    setRangeYear,
  };
}
