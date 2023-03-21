import React from "react";
import { formatAddress, roundPrice, roundPriceUsd } from "@Utils";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { placeholderImage } from "@Assets";

export const Table = React.memo(({ rows, collections }) => {
  const navigate = useNavigate();

  return (
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
        </tr>
      </thead>
      <tbody>
        {rows.map(c => (
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
          </tr>
        ))}
      </tbody>
    </table>
  );
});
