import React from "react";
import "./style.css";

export const Col = ({ children, className = "" }) => <div className={`col ${className}`}>{children}</div>;
