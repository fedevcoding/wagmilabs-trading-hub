import React from "react";
import ReactSelect from "react-select";

import "./style.scss";

export const Select = React.memo(props => {
  const colourStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: "#1E1F25",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : isSelected ? "#1E1F25" : isFocused ? "#1E1F25" : "black",
        color: isDisabled ? "#ccc" : isSelected ? "white" : data.color,
        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
    input: styles => ({ ...styles, color: "white" }),
    placeholder: styles => ({ ...styles, color: "white" }),
    singleValue: styles => ({ ...styles, color: "white" }),
  };

  return <ReactSelect styles={colourStyles} {...props} className={`react-select ${props?.className || ""}`} />;
});
