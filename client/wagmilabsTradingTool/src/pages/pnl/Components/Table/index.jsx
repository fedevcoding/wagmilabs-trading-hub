import React from "react";
import { useTokensInfo } from "./useTokensInfo";
import { Row } from "./Row";
import { Button, LoadingSpinner } from "@Components";
import { notFound } from "@Assets";

export const Table = React.memo(({ data, taxPerc, taxedOn, currency, longTermTax, isLoading }) => {
  const paginationCount = 10;
  const [page, setPage] = React.useState(1);
  const items = data.slice((page - 1) * paginationCount, page * paginationCount);
  const { tokensInfo, isFetchingInitialData } = useTokensInfo(items);
  const totalItems = data.length;
  const itemsInPage = items.length;

  return totalItems ? (
    <>
      {(totalItems > paginationCount && (
        <div className="pagination">
          <p>
            Page {page} - Showing {itemsInPage} of {totalItems} Trades
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
      )}
      <table>
        <thead>
          <tr>
            <th>NFT</th>
            <th>Paid</th>
            <th>Sold</th>
            <th>Fees</th>
            <th>P&L</th>
            <th>Hold duration</th>
            <th>Gross profit</th>
            <th>Taxes owed</th>
          </tr>
        </thead>
        <tbody>
          {(isLoading && (
            <tr>
              <td className="row-loading" colSpan={8}>
                <LoadingSpinner />
              </td>
            </tr>
          )) ||
            ""}
          {items.map(n => (
            <Row
              key={JSON.stringify(n)}
              nft={n.info}
              allInfo={n}
              taxPerc={taxPerc}
              taxedOn={taxedOn}
              currency={currency}
              tokensInfo={tokensInfo}
              longTermTax={longTermTax}
              isFetchingInitialData={isFetchingInitialData}
            />
          ))}
        </tbody>
      </table>
    </>
  ) : (
    <p className="text-center">
      <img src={notFound} alt="best offer" width={150} />
      <br />
      No NFTs were found in this range!
    </p>
  );
});
