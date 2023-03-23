import React from "react";
import { Button } from "@Components";

export const Pagination = ({ page, setPage, totalItems, paginationCount, itemsInPage }) => {
  return (
    (totalItems > paginationCount && (
      <div className="pagination">
        <p>
          Page {page} - Showing {itemsInPage.length} of {totalItems} Collections
        </p>
        {(page > 1 && (
          <Button onClick={() => setPage(page - 1)}>
            <i className="fa-solid fa-backward" />
          </Button>
        )) ||
          ""}
        {(page * paginationCount < totalItems && (
          <Button onClick={() => setPage(page + 1)}>
            <i className="fa-solid fa-forward" />
          </Button>
        )) ||
          ""}
      </div>
    )) || (
      <div className="pagination">
        <p>Showing {totalItems} Trades</p>
      </div>
    )
  );
};
