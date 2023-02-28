import React from "react";
import { formatAddress } from "@Utils/formats/formats";
import { roundPrice, roundPrice2 } from "src/utils/formats/formats";
import moment from "moment";
import { placeholderImage } from "src/assets";
import { LoadingSpinner } from "@Components";
import { useNavigate } from "react-router-dom";

export const Row = React.memo(
  ({ nft, taxPerc, taxedOn, currency, images, isFetchingInitialData }) => {
    const navigate = useNavigate();
    const momentDuration = moment
      .duration(nft.holdDuration, "seconds")
      .humanize();

    const symbol = currency === "usd" ? "$" : " ETH";

    return (
      <tr key={nft.address + nft.id}>
        <td
          className="nft-info-box"
          onClick={() => navigate(`/item/${nft.address}/${nft.id}`)}
        >
          {isFetchingInitialData ? (
            <LoadingSpinner />
          ) : (
            <>
              <img
                src={
                  images[
                    (nft.address + nft.id).toLowerCase() || placeholderImage
                  ]
                }
                alt={"#" + nft.nft.id}
                width={120}
                className="nft-img"
              />
              <div className="nft-text">
                {formatAddress(nft.nft.address)}
                <br />
                {"#" + nft.nft.id}
              </div>
            </>
          )}
        </td>
        <td className="td-paid">
          {nft.paid.eth + " ETH"} <br /> {nft.paid.usd + "$"}
        </td>
        <td className="td-sold">
          {nft.sold.eth + " ETH"} <br /> {nft.sold.usd + "$"}
        </td>
        <td className="td-gas-fees">
          {roundPrice(nft.gasFees.total.eth) + " ETH"} <br />{" "}
          {roundPrice2(nft.gasFees.total.usd) + "$"}
        </td>
        <td className="td-p-or-l">
          {roundPrice(nft.pOrL.eth) + " ETH"} <br />{" "}
          {roundPrice2(nft.pOrL.usd) + "$"}
        </td>
        <td className="duration">
          {nft.holdDuration ? momentDuration : nft.holdDuration}
        </td>
        <td className="gross">
          {roundPrice(nft.gross.eth) + " ETH"} <br />{" "}
          {roundPrice2(nft.gross.usd) + "$"}
        </td>
        <td className="taxes">
          {taxedOn === "net" ? (
            <>
              {nft.pOrL[currency] > 0
                ? roundPrice2((nft.pOrL[currency] / 100) * taxPerc) + symbol
                : "0"}
            </>
          ) : (
            <>
              {nft.gross[currency] > 0
                ? roundPrice2((nft.gross[currency] / 100) * taxPerc) + symbol
                : "0"}
            </>
          )}
        </td>
      </tr>
    );
  }
);
