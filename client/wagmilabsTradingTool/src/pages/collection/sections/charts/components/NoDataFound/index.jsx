import React from "react";
import { notFound } from "src/assets";

export const NoDataFound = () => {
  return (
    <div className="nod-data-found">
      <img src={notFound} alt="no data found" />
      <p>No data found</p>
    </div>
  );
};
