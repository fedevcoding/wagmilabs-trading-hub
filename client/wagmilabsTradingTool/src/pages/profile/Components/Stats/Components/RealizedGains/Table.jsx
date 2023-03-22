import React from "react";
import { formatAddress, roundPrice, roundPriceUsd } from "@Utils";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { placeholderImage } from "@Assets";
import { sortRows } from "./functions";
import { Number } from "@Components";
import { notFound } from "@Assets";
import { useCollections } from "@reservoir0x/reservoir-kit-ui";
import { SortableHeader } from "./SortableHeader";
import { Pagination } from "./Pagination";

export const Table = React.memo(({ rows }) => {
  const paginationCount = 10;
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("bought-count");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const navigate = useNavigate();

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
