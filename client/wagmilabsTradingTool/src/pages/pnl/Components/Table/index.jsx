import React from "react";
import { useImages } from "./useImages";
import { Row } from "./Row";
import { Button } from "@Components";

export const Table = React.memo(({ data, taxPerc, taxedOn, currency }) => {
  const paginationCount = 10;
  const [page, setPage] = React.useState(1);
  const items = data.slice(
    (page - 1) * paginationCount,
    page * paginationCount
  );
  const { images, isFetchingInitialData } = useImages(items);
  const totalItems = data.length;
  const itemsInPage = items.length;

  return totalItems ? (
    <>
      {(totalItems > paginationCount && (
        <div className="pagination">
          <p>
            Page {page} - Showing {itemsInPage} of {totalItems} NFTs
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
          <p>Showing {totalItems} NFTs</p>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>NFT</th>
            <th>Paid</th>
            <th>Sold</th>
            <th>Gas fees</th>
            <th>P&L</th>
            <th>Hold duration</th>
            <th>Gross profit</th>
            <th>Taxes owed</th>
          </tr>
        </thead>
        <tbody>
          {items.map(n => (
            <Row
              key={JSON.stringify(n)}
              nft={n.info}
              taxPerc={taxPerc}
              taxedOn={taxedOn}
              currency={currency}
              images={images}
              isFetchingInitialData={isFetchingInitialData}
            />
          ))}
        </tbody>
      </table>
    </>
  ) : (
    <h3>No NFTs were found in this range!</h3>
  );
});
