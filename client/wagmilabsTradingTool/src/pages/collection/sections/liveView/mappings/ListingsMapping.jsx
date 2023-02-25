import React, { memo } from "react";
import { roundPrice } from "@Utils/formats/formats";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";
import { Button } from "@chakra-ui/react";
import { useBuyNow } from "@Hooks";
import { TimeAgo } from "@Components";

const ListingMapping = memo(({ listings, contractAddress, collectionImage }) => {
  const { buyNow } = useBuyNow();

  return (
    <>
      {listings.map((listing, index) => {
        const { image, marketplace, timestamp, tokenId, name, value } =
          listing || {};

        const marketplaceImage = getMarketplaceImage(marketplace);

        const randomUUID = crypto.randomUUID();
        return (
          <div key={randomUUID} className={`single-item-row`}>
            <div className="token-info-container wrap-text">
              <img src={image || collectionImage} className="item-image" alt="" />
              <div className="wrap-text">
                <p className="wrap-text">{name || tokenId}</p>
                <p className="live-view-sale-time low-opacity little-text">
                  <TimeAgo
                    timestamp={timestamp}
                    isUnix={true}
                    intervalMs={1000}
                  />
                </p>
              </div>
            </div>

            <div className="flex-col-left">
              <p>{roundPrice(value)} ETH</p>
              <div className="sales-logos">
                <img src={marketplaceImage} alt="" />
                <Button
                  colorScheme={"blue"}
                  onClick={() => buyNow(contractAddress, tokenId, value)}
                  className="buy-now-btn"
                >
                  Buy
                </Button>
              </div>
            </div>
          </div>
        );
      }, [collectionImage])}
    </>
  );
});

export default ListingMapping;
