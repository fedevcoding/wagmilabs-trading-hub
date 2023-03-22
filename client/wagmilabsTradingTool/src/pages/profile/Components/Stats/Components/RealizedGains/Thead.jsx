import React from "react";
import { SortableHeader } from "./SortableHeader";

export const Thead = ({ sortBy, setSortBy, setSortOrder }) => {
  return (
    <thead>
      <tr>
        <th>Collection</th>
        <SortableHeader
          text="Bought Count"
          active={sortBy === "bought-count"}
          onSort={newOrder => {
            setSortBy("bought-count");
            setSortOrder(newOrder);
          }}
        />
        <SortableHeader
          text="Bought Price"
          active={sortBy === "bought-price"}
          onSort={newOrder => {
            setSortBy("bought-price");
            setSortOrder(newOrder);
          }}
        />
        <th>Bought Fee</th>
        <SortableHeader
          text="Sold Count"
          active={sortBy === "sold-count"}
          onSort={newOrder => {
            setSortBy("sold-count");
            setSortOrder(newOrder);
          }}
        />
        <SortableHeader
          text="Sold Price"
          active={sortBy === "sold-price"}
          onSort={newOrder => {
            setSortBy("sold-price");
            setSortOrder(newOrder);
          }}
        />
        <th>Sold Fee</th>
        <SortableHeader
          text="Minted Count"
          active={sortBy === "minted-count"}
          onSort={newOrder => {
            setSortBy("minted-count");
            setSortOrder(newOrder);
          }}
        />
        <SortableHeader
          text="Minted Price"
          active={sortBy === "minted-price"}
          onSort={newOrder => {
            setSortBy("minted-price");
            setSortOrder(newOrder);
          }}
        />
        <th>Minted Fee</th>
        <SortableHeader
          text="Net P&L"
          active={sortBy === "profit"}
          onSort={newOrder => {
            setSortBy("profit");
            setSortOrder(newOrder);
          }}
        />
      </tr>
    </thead>
  );
};
