import React from "react";
import "./style.scss";

export const Loader = ({ width, height, notAbsolute }) => {
  return <div className={`lazyloader ${notAbsolute && "not-absolute"}`} style={{ width, height }}></div>;
};
