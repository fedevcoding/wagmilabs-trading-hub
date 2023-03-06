import React from "react";

export function useQuarterRange() {
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
  const quarters = [
    {
      label: `Q${currentQuarter} ${currentYear}`,
      value: `Q${currentQuarter} ${currentYear}`,
      startDate: new Date(currentYear, (currentQuarter - 1) * 3, 1).getTime(),
      endDate: new Date().getTime(),
    },
  ];
  for (let i = 0, quarter = currentQuarter, year = currentYear; i < 10; i++) {
    quarter--;
    if (quarter === 0) {
      quarter = 4;
      year--;
    }
    quarters.push({
      label: `Q${quarter} ${year}`,
      value: `Q${quarter} ${year}`,
      startDate: new Date(year, (quarter - 1) * 3, 1).getTime(),
      endDate: new Date(year, quarter * 3, 1).getTime(),
    });
  }

  const [rangeQuarter, setRangeQuarter] = React.useState(quarters[0]);

  return {
    quarters,
    rangeQuarter,
    setRangeQuarter,
  };
}
