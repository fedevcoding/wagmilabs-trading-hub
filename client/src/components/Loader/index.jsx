import React from "react";
import "./style.scss";

export const Loader = ({ width, height, notAbsolute }) => {
  return (
    <div
      className={`lazyloader ${notAbsolute && "not-absolute"}`}
      style={{ width: width || "20px", height: height || "20px" }}
    ></div>
  );
};
