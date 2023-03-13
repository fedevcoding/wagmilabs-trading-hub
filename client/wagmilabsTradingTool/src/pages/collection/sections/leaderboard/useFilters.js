import React from "react";
import { getDirections, getListSort } from "./functions";

export function useFilters() {
  const listSort = getListSort();
  const [sort, setSort] = React.useState(listSort[5]);
  const listDirections = getDirections();
  const [direction, setDirecton] = React.useState(listDirections[1]);

  return { listSort, sort, setSort, listDirections, direction, setDirecton };
}
