import React from "react";
import "./style.scss";

export const Plus = ({ hasBg, className }) => {
  const classes = `fa-solid fa-plus icon-plus-component ${hasBg && "bg"} ${className || ""}`;
  return <i className={classes}></i>;
};
