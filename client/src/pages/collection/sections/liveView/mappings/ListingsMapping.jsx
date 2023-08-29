import React, { memo } from "react";
import { roundPrice } from "@Utils/formats/formats";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";
import { Button } from "@chakra-ui/react";
import { useBuyNow } from "@Hooks";
import { LoadingSpinner, TimeAgo } from "@Components";
import { getTokenUrl } from "../../../../../utils/getDataFrommarketplace";
import { useGetBuyNowModalFunctions } from "../../../../../custom-hooks";
import { BuyNowModal } from "../../../../../components/Modals/BuyNowModal";

const orderHashes = {};

const ListingMapping = memo(({ listings, contractAddress, collectionImage, isLoading, collectionName }) => {
  const { buyNowModalData, showBuyNowModal, openBuyModal, closeBuynowModal } = useGetBuyNowModalFunctions();

  const { buyNow } = useBuyNow();

  return (
    <>
      {isLoading ? (
        <div className="columns-loader">
          <LoadingSpinner>
            <p>Loading...</p>
          </LoadingSpinner>
        </div>
      ) : (
        <>
          {
            <BuyNowModal
              buyNowModalData={buyNowModalData}
              showBuyNowModal={showBuyNowModal}
              buyNow={buyNow}
              closeBuynowModal={closeBuynowModal}
            />
          }
          {listings.map((listing, index) => {
            const { image, marketplace, timestamp, tokenId, name, value, orderHash, ms } = listing || {};

            const marketplaceImage = getMarketplaceImage(marketplace);

            const toAnimate = index === 0 && !orderHashes[orderHash];

            if (toAnimate) {
              orderHashes[orderHash] = true;
            }

            const link = getTokenUrl(marketplace, tokenId, contractAddress);
            const wagmiLink = `/item/${contractAddress}/${tokenId}`;
            const randomUUID = crypto.randomUUID();
            return (
              <a key={randomUUID} href={wagmiLink} className={`single-item-row ${toAnimate ? "new-listing" : ""}`}>
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
                    <a href={link} target="_blank" rel="noreferrer">
                      <img src={marketplaceImage} alt="" />
                    </a>
                    <Button
                      colorScheme={"blue"}
                      onClick={e => {
                        e.preventDefault();
                        openBuyModal(
                          name,
                          image,
                          tokenId,
                          value,
                          marketplace,
                          contractAddress,
                          collectionName,
                          orderHash
                        );
                        // buyNow(orderHash, value);
                      }}
                      className="buy-now-btn"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </a>
            );
          })}
          <style>
            {`
          .new-listing {
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
      )}
    </>
  );
});

export default ListingMapping;
