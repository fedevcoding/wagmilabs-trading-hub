import React from "react";
import { notFound } from "@Assets";
import { Pagination } from "./Pagination";
import { Thead } from "./Thead";
import { Row } from "./Row";
import { useGetTableInfo } from "./useGetTableInfo";

export const Table = React.memo(({ rows }) => {
  const { collections, page, setPage, totalItems, paginationCount, itemsInPage, sortBy, setSortBy, setSortOrder } =
    useGetTableInfo(rows);

  return (
    <>
      <Pagination
        page={page}
        setPage={setPage}
        totalItems={totalItems}
        paginationCount={paginationCount}
        itemsInPage={itemsInPage}
      />
      <table>
        <Thead sortBy={sortBy} setSortBy={setSortBy} setSortOrder={setSortOrder} />
        <tbody>
          {(!totalItems && (
            <tr>
              <td colSpan="11">
                <p className="text-center">
                  <img src={notFound} alt="best offer" width={150} />
                  <br />
                  No trades found in this range!
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
