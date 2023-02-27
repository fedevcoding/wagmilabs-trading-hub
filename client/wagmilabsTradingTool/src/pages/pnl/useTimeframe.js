import React from "react";

export function useTimeframe() {
  const today = new Date();
  const monthsAgo = new Date().setMonth(today.getMonth() - 3);
  const [startDate, setStartDate] = React.useState(monthsAgo);
  const [endDate, setEndDate] = React.useState(today.getTime());

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
}
