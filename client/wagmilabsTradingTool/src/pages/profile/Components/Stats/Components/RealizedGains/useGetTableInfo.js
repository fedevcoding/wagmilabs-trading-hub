import React from "react";
import { sortRows } from "./functions";
import { useCollections } from "@reservoir0x/reservoir-kit-ui";

export function useGetTableInfo(rows) {
  const paginationCount = 10;
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("bought-count");
  const [sortOrder, setSortOrder] = React.useState("desc");

  const items = sortRows(rows, sortBy, sortOrder);
  const totalItems = items.length;
  const itemsInPage = items.slice((page - 1) * paginationCount, page * paginationCount);

  const collections = useCollections(
    itemsInPage.length
      ? {
          contract: itemsInPage.map(c => c.address).slice(0, 20),
        }
      : false
  )?.data?.reduce((acc, key) => {
    acc[key.primaryContract.toLowerCase()] = {
      img: key.image,
      name: key.name,
    };
    return acc;
  }, {});

  return { collections, page, setPage, totalItems, paginationCount, itemsInPage, sortBy, setSortBy, setSortOrder };
}
