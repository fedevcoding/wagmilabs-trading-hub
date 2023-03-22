import React from "react";
import { formatAddress, roundPrice, roundPriceUsd } from "@Utils";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { placeholderImage } from "@Assets";
import { addingProfit } from "./functions";
import { Number } from "@Components";
import { Button } from "@Components";
import { notFound } from "@Assets";
import { useCollections } from "@reservoir0x/reservoir-kit-ui";

export const Table = React.memo(({ rows }) => {
  const paginationCount = 10;
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();
  const items = addingProfit(rows);
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

  return (
    <>
      {(totalItems > paginationCount && (
        <div className="pagination">
          <p>
            Page {page} - Showing {itemsInPage.length} of {totalItems} Trades
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
            <th>Collection</th>
            <th>Bought Count</th>
            <th>Bought Price</th>
            <th>Bought Fee</th>
            <th>Sold Count</th>
            <th>Sold Price</th>
            <th>Sold Fee</th>
            <th>Minted Count</th>
            <th>Minted Price</th>
            <th>Minted Fee</th>
            <th>Net P&L</th>
          </tr>
        </thead>
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
                <tr key={c.address}>
                  <td className="image">
                    <div onClick={() => navigate(`/collection/${c.address}`)}>
                      {(collections && collections[c.address] && (
                        <>
                          <LazyLoadImage
                            src={collections[c.address]?.img || placeholderImage}
                            className="nft-img"
                            effect="blur"
                            placeholderSrc={placeholderImage}
                            alt={collections[c.address]?.name || ""}
                            width={65}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = placeholderImage;
                            }}
                          />
                          {(collections[c.address]?.name && <div>{collections[c.address].name}</div>) || ""}
                        </>
                      )) || (
                        <>
                          <img src={placeholderImage} alt="Unknown" width={65} />
                          <div>
                            {formatAddress(c.address)} <br />
                            {"Unknown collection"}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td>{c.bought.count}</td>
                  <td>
                    {roundPriceUsd(c.bought.usd_price)}$
                    <br />
                    <i className="fa-brands fa-ethereum" />
                    {roundPrice(c.bought.eth_price)}
                  </td>
                  <td>
                    <i className="fa-brands fa-ethereum" />
                    {roundPrice(c.bought.fee)}
                  </td>
                  <td>{c.sold.count}</td>
                  <td>
                    {roundPriceUsd(c.sold.usd_price)}$
                    <br />
                    <i className="fa-brands fa-ethereum" />
                    {roundPrice(c.sold.eth_price)}
                  </td>
                  <td>
                    <i className="fa-brands fa-ethereum" />
                    {roundPrice(c.sold.fee)}
                  </td>
                  <td>{c.minted.count}</td>
                  <td>
                    <i className="fa-brands fa-ethereum" />
                    {roundPrice(c.minted.eth_price)}
                  </td>
                  <td>
                    <i className="fa-brands fa-ethereum" />
                    {roundPrice(c.minted.fee)}
                  </td>
                  <td>
                    <Number n={c.profit} symbol={" ETH"} />
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </>
  );
});
