import React from "react";
import { notFound } from "@Assets";
import { Pagination } from "./Pagination";
import { Thead } from "./Thead";
import { Row } from "./Row";
import { useGetTableInfo } from "./useGetTableInfo";
import { Select } from "@Components";
import { sortOptions } from "./functions";

export const Table = React.memo(({ rows }) => {
  const { collections, page, setPage, totalItems, paginationCount, itemsInPage, sortBy, setSortBy, setSortOrder } =
    useGetTableInfo(rows);

  return (
    <>
      <div className="space-between">
        <h3>Realized gains</h3>
        <Pagination
          page={page}
          setPage={setPage}
          totalItems={totalItems}
          paginationCount={paginationCount}
          itemsInPage={itemsInPage}
        />
        <div className="flex">
          <span>Sort:</span>
          <Select
            id="sort"
            onChange={s => {
              setSortBy(s.value);
              setSortOrder("desc");
            }}
            label="Set Sort"
            value={sortOptions.find(s => s.value === sortBy)}
            options={sortOptions}
            isSearchable={false}
          />
        </div>
      </div>
      <table>
        <Thead sortBy={sortBy} setSortBy={setSortBy} setSortOrder={setSortOrder} />
        <tbody>
          {(!totalItems && (
            <tr>
              <td colSpan="11">
                <p className="text-center">
                  <img src={notFound} alt="best offer" width={150} />
                  <br />
                  No collections found in this range!
                </p>
              </td>
            </tr>
          )) || (
            <>
              {itemsInPage.map(c => (
                <Row key={c.address} c={c} collections={collections} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </>
  );
});
