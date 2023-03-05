import React from "react";
import { roundPrice, roundPriceUsd } from "@Utils";
import moment from "moment";
import { placeholderImage } from "@Assets";
import { LoadingSpinner, Number } from "@Components";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@chakra-ui/react";

export const Row = React.memo(({ nft, allInfo, taxPerc, taxedOn, currency, tokensInfo, isFetchingInitialData }) => {
  const navigate = useNavigate();
  const momentDuration = moment.duration(nft.holdDuration, "seconds").humanize();
  const symbol = currency === "usd" ? "$" : " ETH";
  const tokenInfo = tokensInfo[(nft.nft.address + nft.nft.id).toLowerCase()];
  const isMinted = !!allInfo.minted;

  return (
    <tr>
      <td className="nft-info-box" onClick={() => navigate(`/item/${nft.nft.address}/${nft.nft.id}`)}>
        {isFetchingInitialData ? (
          <LoadingSpinner />
        ) : (
          <>
            <img src={tokenInfo?.image || placeholderImage} alt={"#" + nft.nft.id} width={70} className="nft-img" />
            <div className="nft-text">
              {isMinted ? <div className="mint-label">Minted</div> : <></>}
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
        {isMinted ? (
          <a href={`https://etherscan.io/tx/${allInfo.minted.transaction_hash}`} target="_blank" rel="noreferrer">
            {`${roundPrice(nft.gasFees.minted.eth)} ETH`} <br /> {roundPriceUsd(nft.gasFees.minted.usd) + "$"}
          </a>
        ) : (
          <a href={`https://etherscan.io/tx/${allInfo.bought.transaction_hash}`} target="_blank" rel="noreferrer">
            {nft.paid.eth + " ETH"} <br /> {nft.paid.usd + "$"}
          </a>
        )}
      </td>
      <td className="td-sold">
        <a href={`https://etherscan.io/tx/${allInfo.sold.transaction_hash}`} target="_blank" rel="noreferrer">
          {nft.sold.eth + " ETH"} <br /> {nft.sold.usd + "$"}
        </a>
      </td>
      <td className="td-gas-fees">
        <Tooltip
          closeOnClick={false}
          hasArrow
          label={
            <>
              {`Royalty fees: ${roundPrice(nft.gasFees.sold.royaltyFee)} ETH`}
              <br />
              {`Platform fees: ${roundPrice(nft.gasFees.sold.platformFee)} ETH`}
              {(nft.gasFees?.paid?.tx?.eth && (
                <>
                  <br />
                  {`buy fees: ${roundPrice(nft.gasFees.paid.tx.eth)} ETH`}
                </>
              )) ||
                ""}
              {(nft.gasFees?.approval?.eth && (
                <>
                  <br />
                  {`Approval fees: ${roundPrice(nft.gasFees.approval.eth)} ETH`}
                </>
              )) ||
                ""}
              {(nft.gasFees?.minted?.eth && (
                <>
                  <br />
                  {`Minted fees: ${roundPrice(nft.gasFees.minted.eth)} ETH`}
                </>
              )) ||
                ""}
            </>
          }
          fontSize="xs"
          bg="black"
          color={"white"}
          placement="top"
          borderRadius={"7px"}
        >
          <div>
            {roundPrice(nft.gasFees.total.eth) + " ETH"} <br /> {roundPriceUsd(nft.gasFees.total.usd) + "$"}
          </div>
        </Tooltip>
      </td>
      <td className="td-p-or-l">
        <Number n={nft.pOrL.eth} symbol={" ETH"} />
        <br />
        <Number n={nft.pOrL.usd} symbol={"$"} crypto={false} />
      </td>
      <td className="duration">{nft.holdDuration ? momentDuration : nft.holdDuration}</td>
      <td className="gross">
        <Tooltip
          closeOnClick={false}
          hasArrow
          label={
            "Gross Profit is listed value minus creator royalties & marketplace fees (which is what effectively enters your wallet after a sale)."
          }
          fontSize="xs"
          bg="black"
          color={"white"}
          placement="top"
          borderRadius={"7px"}
        >
          <div>
            {roundPrice(nft.gross.eth) + " ETH"} <br /> {roundPriceUsd(nft.gross.usd) + "$"}
          </div>
        </Tooltip>
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
