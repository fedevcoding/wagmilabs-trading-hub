import React from "react";

export function useTimeframe() {
  const today = new Date();
  const aMonthAgo = new Date().setMonth(today.getMonth() - 1);
  const [startDate, setStartDate] = React.useState(aMonthAgo);
  const [endDate, setEndDate] = React.useState(today.getTime());

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
}
