import React from "react";
import "./style.scss";

export const Close = ({ hasBg, className, onClick }) => {
  const classes = `fa-solid fa-x icon-x-component ${hasBg && "bg"} ${className || ""}`;
  return <i className={classes} onClick={onClick}></i>;
};
