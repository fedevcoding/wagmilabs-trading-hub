import React from "react";

import "./style.scss";

export const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>{children}</div>
);
