import React from "react";
import { Card, LoadingSpinner } from "@Components";
import { useGetData } from "./useGetData";
import { formatAddress, roundPrice, roundPriceUsd } from "@Utils";
import { useCollections } from "@reservoir0x/reservoir-kit-ui";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { placeholderImage } from "@Assets";

import "./style.scss";

export const RealizedGains = React.memo(({ address }) => {
  const { data, isLoading } = useGetData(address);

  const collections = useCollections(
    (data || {})?.collections
      ? {
          contract: data.collections.map(c => c.address).slice(0, 20),
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
    <Card className="realized-gains">
      <h3>Realized gains</h3>
      {(isLoading && <LoadingSpinner />) || (
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Bought Count</th>
              <th>Bought Price</th>
              <th>Bought Fee</th>
              <th>Sold Count</th>
              <th>Sold Price</th>
              <th>Sold Fee</th>
              <th>Minted Count</th>
              <th>Minted Price</th>
              <th>Minted Fee</th>
            </tr>
          </thead>
          <tbody>
            {((data || {})?.collections || []).map(c => (
              <tr key={c.address}>
                <td className="image">
                  <div>
                    {(collections[c.address] && (
                      <LazyLoadImage
                        src={collections[c.address].img || placeholderImage}
                        className="nft-img"
                        effect="blur"
                        placeholderSrc={placeholderImage}
                        alt={collections[c.address].name}
                        width={65}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = placeholderImage;
                        }}
                      />
                    )) ||
                      ""}
                    <div>
                      {formatAddress(c.address)}
                      {(collections[c.address] && (
                        <>
                          <br />
                          {collections[c.address].name}
                        </>
                      )) ||
                        ""}
                    </div>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
});
