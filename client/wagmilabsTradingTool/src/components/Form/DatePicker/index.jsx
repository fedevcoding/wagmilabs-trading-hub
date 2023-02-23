import React from "react";
import ReactDatePicker from "react-datepicker";

import "./style.scss";

export const DatePicker = React.memo(
  ({
    onChange,
    className = "",
    placeholderText = "",
    selectsRange = false,
    startDate = undefined,
    endDate = undefined,
    minDate = undefined,
    maxDate = undefined,
    ...props
  }) => {
    return (
      <ReactDatePicker
        selectsRange={selectsRange}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChange}
        isClearable={true}
        placeholderText={placeholderText}
        className={`date-picker ${className}`}
        {...props}
      />
    );
  }
);
