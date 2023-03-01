import React from "react";
import { roundPrice, roundPriceUsd } from "@Utils";
import moment from "moment";
import { placeholderImage } from "@Assets";
import { LoadingSpinner } from "@Components";
import { useNavigate } from "react-router-dom";

export const Row = React.memo(({ nft, taxPerc, taxedOn, currency, tokensInfo, isFetchingInitialData }) => {
  const navigate = useNavigate();
  const momentDuration = moment.duration(nft.holdDuration, "seconds").humanize();
  const symbol = currency === "usd" ? "$" : " ETH";
  const tokenInfo = tokensInfo[(nft.nft.address + nft.nft.id).toLowerCase()];

  return (
    <tr>
      <td className="nft-info-box" onClick={() => navigate(`/item/${nft.nft.address}/${nft.nft.id}`)}>
        {isFetchingInitialData ? (
          <LoadingSpinner />
        ) : (
          <>
            <img src={tokenInfo?.image || placeholderImage} alt={"#" + nft.nft.id} width={70} className="nft-img" />
            <div className="nft-text">
              {tokenInfo?.collection?.name && !tokenInfo?.name?.includes(tokenInfo?.collection?.name) && (
                <>
                  {tokenInfo?.collection?.name || ""} <br />
                </>
              )}
              {tokenInfo?.name || ""}
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
        {roundPrice(nft.gasFees.total.eth) + " ETH"} <br /> {roundPriceUsd(nft.gasFees.total.usd) + "$"}
      </td>
      <td className="td-p-or-l">
        {roundPrice(nft.pOrL.eth) + " ETH"} <br /> {roundPriceUsd(nft.pOrL.usd) + "$"}
      </td>
      <td className="duration">{nft.holdDuration ? momentDuration : nft.holdDuration}</td>
      <td className="gross">
        {roundPrice(nft.gross.eth) + " ETH"} <br /> {roundPriceUsd(nft.gross.usd) + "$"}
      </td>
      <td className="taxes">
        {taxedOn === "net" ? (
          <>{nft.pOrL[currency] >= 0 ? roundPriceUsd((nft.pOrL[currency] / 100) * taxPerc) + symbol : "0.00$"}</>
        ) : (
          <>{nft.gross[currency] >= 0 ? roundPriceUsd((nft.gross[currency] / 100) * taxPerc) + symbol : "0.00$"}</>
        )}
      </td>
    </tr>
  );
});
