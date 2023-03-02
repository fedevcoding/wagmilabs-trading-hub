import React, { memo } from "react";
import { roundPrice } from "@Utils/formats/formats";
import etherscan from "@Assets/etherscan.svg";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";
import { TimeAgo } from "@Components";

const salesHashes = {};

const SalesMapping = memo(({ sales, address, collectionImage }) => {
  return (
    <>
      {sales.map((sale, index) => {
        const { value, transactionHash, timestamp, name, image, marketplace, tokenId } = sale || {};

        const marketplaceImage = getMarketplaceImage(marketplace);

        const toAnimate = index === 0 && !salesHashes[transactionHash] ? true : false;

        if (toAnimate) {
          salesHashes[transactionHash] = true;
        }

        const itemLink = `https://opensea.io/assets/${address}/${tokenId}`;
        const randomUUID = crypto.randomUUID();
        return (
          <a
            key={randomUUID}
            className={`single-item-row ${toAnimate ? "new-sale" : ""}`}
            href={`/item/${address}/${tokenId}`}
          >
            <div className="token-info-container wrap-text">
              <img src={image || collectionImage} className="item-image" alt="" />
              <div className="wrap-text">
                <p className="wrap-text">{name || tokenId}</p>
                <p className="live-view-sale-time low-opacity little-text">
                  <TimeAgo timestamp={timestamp} isUnix={false} intervalMs={1000} />
                </p>
              </div>
            </div>

            <div className="flex-col-left">
              <p>{roundPrice(value)} ETH</p>
              <div className="sales-logos">
                <a href={itemLink}>
                  <img src={marketplaceImage} alt="" />
                </a>
                <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noreferrer">
                  <img src={etherscan} alt="" />
                </a>
              </div>
            </div>
          </a>
        );
      })}

      <style>
        {`
          .new-sale {
            animation: appear 1s;
          }

          @keyframes appear {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
});

export default SalesMapping;
