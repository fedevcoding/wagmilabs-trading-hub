import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

export const TableLink = linkProps => {
  const { className } = linkProps;
  const classes = className ? `table-link ${className}` : "table-link";

  return <Link {...linkProps} className={classes}></Link>;
};
