import React from "react";
import { formatAddress } from "@Utils/formats/formats";
import { roundPrice, roundPrice2 } from "src/utils/formats/formats";
import moment from "moment";

export const Table = React.memo(({ data, taxPerc, taxedOn, currency }) => {
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

          const momentDuration = moment
            .duration(nft.holdDuration, "seconds")
            .humanize();

          const symbol = currency === "usd" ? "$" : " ETH";

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
              <td>
                {roundPrice(nft.pOrL.eth) + " ETH"} <br />{" "}
                {roundPrice2(nft.pOrL.usd) + "$"}
              </td>
              <td>{nft.holdDuration ? momentDuration : nft.holdDuration}</td>
              <td>
                {roundPrice(nft.gross.eth) + " ETH"} <br />{" "}
                {roundPrice2(nft.gross.usd) + "$"}
              </td>
              <td>
                {taxedOn === "net" ? (
                  <>
                    {nft.pOrL[currency] > 0
                      ? roundPrice2((nft.pOrL[currency] / 100) * taxPerc) +
                        symbol
                      : "0"}
                  </>
                ) : (
                  <>
                    {nft.gross[currency] > 0
                      ? roundPrice2((nft.gross[currency] / 100) * taxPerc) +
                        symbol
                      : "0"}
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
