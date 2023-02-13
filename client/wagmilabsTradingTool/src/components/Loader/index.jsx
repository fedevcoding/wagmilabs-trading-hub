import React from "react";
import "./style.css";

export const Loader = ({ width, height }) => {
  return <div className="lazyloader" style={{ width, height }}></div>;
};
