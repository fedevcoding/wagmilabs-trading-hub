import React, { memo } from 'react'
import { roundPrice } from '../../../../../utils/formats/formats';
import etherscan from "../../../../../assets/etherscan.svg";
import getMarketplaceImage from '../../../../../utils/marketplaceImageMapping';
import { TimeAgo } from "@Components";


const SalesMapping = memo(({ sales, address }) => {

    return (
        <>
            {
                sales.map((sale, index) => {
                    const { value, transactionHash, timestamp, name, image, marketplace, tokenId } = sale || {};

                    const marketplaceImage = getMarketplaceImage(marketplace);

                    const itemLink = `https://opensea.io/assets/${address}/${tokenId}`
                    const randomUUID = crypto.randomUUID();
                    return (
                        <a
                            key={randomUUID}
                            className={`single-item-row`}
                            href={`/item/${address}/${tokenId}`}
                        >
                            <div className="token-info-container wrap-text">
                                <img src={image} className="item-image" alt="" />
                                <div className='wrap-text'>
                                    <p className='wrap-text'>{name}</p>
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
                                    <a
                                        href={`https://etherscan.io/tx/${transactionHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img src={etherscan} alt="" />
                                    </a>
                                </div>
                            </div>
                        </a>
                    );
                })
            }
        </>
    )
})

export default SalesMapping