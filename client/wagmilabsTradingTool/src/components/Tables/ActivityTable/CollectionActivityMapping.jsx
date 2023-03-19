import React from "react";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";
import { formatAddress3, roundPrice2 } from "@Utils/formats/formats";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { activityTypeMapping } from "./functions";
import { ActivityIcon } from "./ActivityIcon";

export const CollectionActivityMapping = React.memo(({ collectionActivity, address }) => {
  const navigate = useNavigate();

  return collectionActivity.map((item, index) => {
    const { type, fromAddress, toAddress, price, timestamp, txHash } = item ?? {};

    const { tokenName, tokenImage, tokenId } = item.token;
    const { collectionName, collectionImage } = item.collection;

    const activityType = activityTypeMapping[type];

    const marketplaceName = item?.order?.source?.name;
    const marketplaceImage = getMarketplaceImage(marketplaceName);
    const isLast = index === collectionActivity.length - 1;
    return (
      <React.Fragment key={JSON.stringify(item)}>
        <tr
          onClick={e => {
            if (
              !Array.from(e?.target?.classList || []).filter(element =>
                ["collection-activity-single-time", "time", "fa-sharp"].includes(element)
              ).length
            ) {
              navigate(`/item/${address}/${tokenId}`);
            }
          }}
          className={`collection-activity-single-container ${isLast ? "last-token" : ""}`}
        >
          <td className="collection-activity-single-type">
            <div className="collection-activity-marketplace-container">
              {marketplaceImage ? (
                <img src={marketplaceImage} className="collection-activity-marketplace-image" alt="" />
              ) : (
                <ActivityIcon type={type} />
              )}
              {activityType}
            </div>
          </td>

          <td className="collection-activity-single-token">
            <img src={tokenImage || collectionImage} alt="" className="collection-activity-single-image" />
            <div className="wrap-text">
              <p className="wrap-text">{tokenName || collectionName}</p>
              <p className="low-opacity little-text wrap-text">{collectionName}</p>
            </div>
          </td>
          <td className="collection-activity-single-price">{price ? roundPrice2(price) : 0} ETH</td>
          <td className="collection-activity-single-from">{fromAddress ? formatAddress3(fromAddress) : "- - -"}</td>
          <td className="collection-activity-single-to">{toAddress ? formatAddress3(toAddress) : "- - -"}</td>
          <td className="collection-activity-single-time">
            <a
              className={`collection-activity-time ${type !== "ask" && "link"}`}
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              <p className="time">{moment(timestamp * 1000).fromNow()}</p>
              {type !== "ask" && <i className="fa-sharp fa-solid fa-up-right-from-square"></i>}
            </a>
          </td>
        </tr>
      </React.Fragment>
    );
  });
});
