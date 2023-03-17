import React from "react";
import "./style.scss";

export const LoadingSpinner = ({ children, width, height, padding, margin }) => (
  <div className="loading-spinner" style={{ padding: padding ?? "10px 0", margin: margin ?? "0" }}>
    {children}
    <span class="loader" style={{ width: width ?? "20px", height: height ?? "20px" }}></span>
  </div>
);
