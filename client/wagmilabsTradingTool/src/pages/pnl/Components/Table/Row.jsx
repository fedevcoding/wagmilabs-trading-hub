import React from "react";
import { roundPrice, roundPriceUsd } from "@Utils";
import moment from "moment";
import { placeholderImage } from "@Assets";
import { LoadingSpinner, Number } from "@Components";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@chakra-ui/react";
import { getTaxValue } from "./functions";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const Row = React.memo(
  ({ nft, allInfo, taxPerc, taxedOn, currency, tokensInfo, longTermTax, isFetchingInitialData }) => {
    const navigate = useNavigate();
    const momentDuration = moment.duration(nft.holdDuration, "seconds").humanize();
    const { id: tokenId } = nft.nft;
    const { address: tokenAddress } = nft.nft;
    const tokenInfo = tokensInfo[(nft.nft.address + nft.nft.id).toLowerCase()];
    const isMinted = !!allInfo.minted;
    const taxValue = getTaxValue(nft, taxedOn, currency, taxPerc, longTermTax);

    return (
      <tr>
        <td className="nft-info-box" onClick={() => navigate(`/item/${tokenAddress}/${tokenId}`)}>
          {isFetchingInitialData ? (
            <LoadingSpinner />
          ) : (
            <>
              <LazyLoadImage
                src={tokenInfo?.image || placeholderImage}
                className="nft-img"
                effect="blur"
                placeholderSrc={placeholderImage}
                alt={"#" + nft.nft.id}
                width={65}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = placeholderImage;
                }}
              />
              <div className="nft-text">
                {isMinted ? <div className="mint-label">Minted</div> : <></>}
                {tokenInfo?.collection?.name && !tokenInfo?.name?.includes(tokenInfo?.collection?.name) && (
                  <>
                    {tokenInfo?.collection?.name || ""} <br />
                  </>
                )}
                {tokenInfo?.name || tokenId}
              </div>
            </>
          )}
        </td>
        <td className="td-paid">
          {isMinted ? (
            <a href={`https://etherscan.io/tx/${allInfo.minted.transaction_hash}`} target="_blank" rel="noreferrer">
              {nft.paid.eth + " ETH"} <br /> {roundPriceUsd(nft.paid.usd) + "$"}
            </a>
          ) : (
            <a href={`https://etherscan.io/tx/${allInfo.bought.transaction_hash}`} target="_blank" rel="noreferrer">
              {nft.paid.eth + " ETH"} <br /> {nft.paid.usd + "$"}
            </a>
          )}
        </td>
        <td className="td-sold">
          <a href={`https://etherscan.io/tx/${allInfo.sold.transaction_hash}`} target="_blank" rel="noreferrer">
            {roundPrice(nft.sold.eth) + " ETH"} <br /> {roundPriceUsd(nft.sold.usd) + "$"}
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
        <td className="taxes">{taxValue}</td>
      </tr>
    );
  }
);
