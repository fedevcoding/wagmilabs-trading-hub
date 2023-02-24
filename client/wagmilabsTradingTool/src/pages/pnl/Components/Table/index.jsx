import React from "react";
import { formatAddress } from "@Utils/formats/formats";
import { roundPrice, roundPrice2 } from "src/utils/formats/formats";

export const Table = React.memo(({ data }) => {
  return (
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
        {data.map(n => {
          const nft = n.info;
          return (
            <tr key={n.info.nft.address + n.info.nft.id}>
              <td>
                {formatAddress(nft.nft.address)}
                <br />
                {"#" + nft.nft.id}
              </td>
              <td>
                {nft.paid.eth + " ETH"} <br /> {nft.paid.usd + "$"}
              </td>
              <td>
                {nft.sold.eth + " ETH"} <br /> {nft.sold.usd + "$"}
              </td>
              <td>
                {roundPrice(nft.gasFees.total.eth) + " ETH"} <br />{" "}
                {roundPrice2(nft.gasFees.total.usd) + "$"}
              </td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
