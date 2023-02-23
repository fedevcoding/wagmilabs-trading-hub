import { Button, DatePicker } from "@Components";
import React from "react";

export const SettingsAndFilters = React.memo(
  ({ startDate, endDate, setStartDate, setEndDate }) => {
    const today = new Date();
    const aYearAgo = new Date().setFullYear(today.getFullYear() - 1);

    return (
      <>
        <Button>Tax settings</Button>
        <p className="timeframe">Timeframe</p>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          minDate={aYearAgo}
          maxDate={today.getTime()}
          onChange={update => {
            const start = update[0] ? update[0] : null;
            const end = update[1] ? update[1] : null;
            setStartDate(
              typeof start === "number" ? start : new Date(start).getTime()
            );
            setEndDate(typeof end === "number" ? end : new Date(end).getTime());
          }}
          isClearable={true}
          placeholderText="Select timeframe"
        />
      </>
    );
  }
);
