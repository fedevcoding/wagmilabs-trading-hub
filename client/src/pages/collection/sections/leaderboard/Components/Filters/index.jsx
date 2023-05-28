import React from "react";
import { Select } from "@Components";

export const Filters = React.memo(({ listSort, sort, setSort, listDirections, direction, setDirecton }) => {
  return (
    <div className="space-between">
      <h2>Profit leaderboard</h2>
      <div className="table-filters">
        <div className="sort-box">
          <span>Sort order:</span>
          <Select
            id="set-sort"
            onChange={s => setSort(s)}
            label="Set Sort"
            value={sort}
            options={listSort}
            isSearchable={false}
          />
        </div>
        <div className="sort-box">
          <span>Sort direction:</span>
          <Select
            id="set-direction"
            onChange={d => setDirecton(d)}
            label="Set direction"
            value={direction}
            options={listDirections}
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  );
});
