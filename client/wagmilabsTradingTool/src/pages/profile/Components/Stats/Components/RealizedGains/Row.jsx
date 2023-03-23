import React from "react";
import { formatAddress, roundPrice, roundPriceUsd } from "@Utils";
import { placeholderImage } from "@Assets";
import { Number, Image } from "@Components";
import { useNavigate } from "react-router-dom";

export const Row = ({ c, collections }) => {
  const navigate = useNavigate();

  return (
    <tr>
      <td className="image">
        <div onClick={() => navigate(`/collection/${c.address}`)}>
          {(collections && collections[c.address] && (
            <>
              <Image
                src={collections[c.address]?.img}
                className="nft-img"
                alt={collections[c.address]?.name || ""}
                borderRadius
                square
                width={50}
              />
              {(collections[c.address]?.name && <div>{collections[c.address].name}</div>) || ""}
            </>
          )) || (
            <>
              <img src={placeholderImage} alt="Unknown" width={50} />
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
  );
};
