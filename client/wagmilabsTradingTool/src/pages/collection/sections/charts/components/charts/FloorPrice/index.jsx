import React from "react";
import { useGetData } from "./useGetData";

export const FloorChart = ({ collectionAddress }) => {
  const { data } = useGetData({ collectionAddress });
  return <div id="twFloorChart"></div>;
};
