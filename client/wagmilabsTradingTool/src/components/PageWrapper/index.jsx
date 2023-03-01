import React from "react";
import "./style.scss";

export const PageWrapper = ({ page, children }) => (
  <div className="page-wrapper" id={`page-${page}`}>
    {children}
  </div>
);
