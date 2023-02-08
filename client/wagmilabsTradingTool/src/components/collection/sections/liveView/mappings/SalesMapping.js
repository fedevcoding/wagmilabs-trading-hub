import React, { memo } from 'react'
import { formatTime, roundPrice } from '../../../../../utils/formats/formats';
import etherscan from "../../../../../assets/etherscan.svg";
import getMarketplaceImage from '../../../../../utils/marketplaceImageMapping';

const SalesMapping = memo(({ sales }) => {
    return (
        <>
            {
                sales.map((sale, index) => {
                    const { value, transactionHash, timestamp, name, image, marketplace } = sale;

                    const marketplaceImage = getMarketplaceImage(marketplace);

                    const time = formatTime(timestamp);

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
                                    <a
                                        href={`https://etherscan.io/tx/${transactionHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img src={etherscan} alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </>
    )
})

export default SalesMapping