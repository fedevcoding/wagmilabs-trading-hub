import React, { memo } from 'react'
import { formatTime, roundPrice } from '../../../../../utils/formats/formats';
import getMarketplaceImage from '../../../../../utils/marketplaceImageMapping';
import { Button } from '@chakra-ui/react';
import { useBuyNow } from '../../../../../custom-hooks';

const ListingMapping = memo(({ listings, contractAddress }) => {

    const { buyNow } = useBuyNow();

    return (
        <>
            {
                listings.map((listing, index) => {
                    const { image, marketplace, timestamp, tokenId, name, value } = listing || {};

                    const marketplaceImage = getMarketplaceImage(marketplace);

                    const time = formatTime(timestamp * 1000);

                    const randomUUID = crypto.randomUUID();
                    return (
                        <div
                            key={randomUUID}
                            className={`single-item-row`}
                        >
                            <div className="token-info-container">
                                <img src={image} className="item-image" alt="" />
                                <div>
                                    <p>{name}</p>
                                    <p className="live-view-sale-time low-opacity little-text">{time}</p>
                                </div>
                            </div>

                            <div className="flex-col-left">
                                <p>{roundPrice(value)} ETH</p>
                                <div className="sales-logos">
                                    <img src={marketplaceImage} alt="" />
                                    <Button colorScheme={"blue"} onClick={() => buyNow(contractAddress, tokenId, value)} className="buy-now-btn">Buy</Button>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </>
    )
})

export default ListingMapping