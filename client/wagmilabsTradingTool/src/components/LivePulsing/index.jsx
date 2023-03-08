import React from "react";

import "./style.scss";

export const LivePulsing = ({ notActive }) => {
  return <div className={`blob ${notActive && "not-active"}`} />;
};
