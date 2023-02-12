import React from "react";
import "./style.css";

export const Row = ({ children, className = "" }) => (
  <div className={`row ${className}`}>{children}</div>
);
