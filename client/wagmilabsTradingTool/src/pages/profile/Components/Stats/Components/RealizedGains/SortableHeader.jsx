import React from "react";

export const SortableHeader = ({ text, onSort, active }) => {
  const [sortOrder, setSortOrder] = React.useState("");

  const handleClick = () => {
    const newOrder = sortOrder === "" || sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    onSort(newOrder);
  };

  return (
    <th className="sortable" onClick={handleClick}>
      {text} {sortOrder === "asc" && active && <i className="fa-solid fa-caret-up" />}
      {sortOrder === "desc" && active && <i className="fa-solid fa-caret-down" />}
    </th>
  );
};
