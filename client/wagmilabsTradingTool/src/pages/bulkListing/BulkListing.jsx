import React from "react";
import { useLocation } from "react-router-dom";

const BulkListing = () => {
  const { state } = useLocation();

  console.log(state);
  return <div>BulkListing</div>;
};

export default BulkListing;
