import React, { useEffect, useMemo, useState, useRef } from "react";
import { formatAddress3, roundPrice2 } from "@Utils/formats/formats.js";
import getMarketplaceImage from "@Utils/marketplaceImageMapping.js";
import { Tabs } from "@Components";
import { ActivityChart, ActivityIcon } from "./Components";
import {
  activityTypeMapping,
  changeActivityFilter,
  getActivityData,
  getChartData,
  getMoreActivity,
  periods,
} from "./functions";
import moment from "moment";

import "./style.scss";

const Activity = ({ address }) => {
  const [loadingMoreActivity, setLoadingMoreActivity] = useState(false);
  const activityContinuation = useRef();
  const observer = useRef(null);

  const [activityChartData, setActivityChartData] = useState({});
  const [, setLoadingChart] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("24h");

  const [collectionActivity, setCollectionActivity] = useState([]);
  const [collectionActivityLoading, setCollectionActivityLoading] =
    useState(true);

  const [collectuonActivityFilter, setCollectionActivityFilter] = useState([
    "sale",
  ]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && activityContinuation.current) {
        getMoreActivity(
          address,
          setLoadingMoreActivity,
          collectuonActivityFilter,
          activityContinuation,
          setCollectionActivity,
          setCollectionActivityLoading
        );
      }
    }, options);

    const target = document.querySelector(
      ".collection-activity-single-container.last-token"
    );
    if (target) {
      observer.current.observe(target);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionActivity]);

  useEffect(() => {
    getChartData(address, setLoadingChart, setActivityChartData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartPeriod]);

  useEffect(() => {
    getActivityData(
      address,
      setCollectionActivityLoading,
      collectuonActivityFilter,
      activityContinuation,
      setCollectionActivity
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectuonActivityFilter]);

  const collectionActivityMapping = useMemo(
    () =>
      collectionActivity.map((item, index) => {
        const { type, fromAddress, toAddress, price, timestamp, txHash } =
          item ?? {};
        const { tokenName, tokenImage, tokenId } = item.token;
        const { collectionName, collectionImage } = item.collection;

        const activityType = activityTypeMapping[type];

        const marketplaceName = item?.order?.source?.name;
        const marketplaceImage = getMarketplaceImage(marketplaceName);
        const isLast = index === collectionActivity.length - 1;
        const key = crypto.randomUUID();
        return (
          <React.Fragment key={JSON.stringify(item)}>
            <a
              href={`/item/${address}/${tokenId}`}
              key={key}
              className={`collection-activity-single-container ${
                isLast && "last-token"
              }`}
            >
              <td className="collection-activity-single-type">
                <div className="collection-activity-marketplace-container">
                  {marketplaceImage ? (
                    <img
                      src={marketplaceImage}
                      className="collection-activity-marketplace-image"
                      alt=""
                    />
                  ) : (
                    <ActivityIcon type={type} />
                  )}
                  {activityType}
                </div>
              </td>

              <td className="collection-activity-single-token">
                <img
                  src={tokenImage || collectionImage}
                  alt=""
                  className="collection-activity-single-image"
                />
                <div className="wrap-text">
                  <p className="wrap-text">{tokenName || collectionName}</p>
                  <p className="low-opacity little-text wrap-text">
                    {collectionName}
                  </p>
                </div>
              </td>
              <td className="collection-activity-single-price">
                {price ? roundPrice2(price) : 0} ETH
              </td>
              <td className="collection-activity-single-from">
                {fromAddress ? formatAddress3(fromAddress) : "- - -"}
              </td>
              <td className="collection-activity-single-to">
                {toAddress ? formatAddress3(toAddress) : "- - -"}
              </td>
              <td className="collection-activity-single-time">
                <a
                  className={`collection-activity-time ${
                    type !== "ask" && "link"
                  }`}
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>{moment(timestamp * 1000).fromNow()}</p>
                  {type !== "ask" && (
                    <i className="fa-sharp fa-solid fa-up-right-from-square"></i>
                  )}
                </a>
              </td>
            </a>

            <tr className="collection-activity-single-hr">
              <td colSpan={6}>
                <hr></hr>
              </td>
            </tr>
          </React.Fragment>
        );
      }),
    [collectionActivity, address]
  );

  return (
    <>
      <hr className="collection-activity-hr" />
      <div className="collection-activity-section">
        <div className="collection-activity-filters-container">
          <p>CATEGORY</p>

          <div className="collection-activity-filters-categories">
            <div
              onClick={() =>
                changeActivityFilter(
                  "sale",
                  collectuonActivityFilter,
                  setCollectionActivityFilter
                )
              }
              className={`${
                collectuonActivityFilter.includes("sale") ? "active" : ""
              }`}
            >
              <i className="fa-light fa-bag-shopping"></i>
              Sales
            </div>
            <div
              onClick={() =>
                changeActivityFilter(
                  "ask",
                  collectuonActivityFilter,
                  setCollectionActivityFilter
                )
              }
              className={`${
                collectuonActivityFilter.includes("ask") ? "active" : ""
              }`}
            >
              <i className="fa-light fa-tag"></i>
              Listings
            </div>
          </div>
          <div className="collection-activity-filters-categories">
            <div
              onClick={() =>
                changeActivityFilter(
                  "bid",
                  collectuonActivityFilter,
                  setCollectionActivityFilter
                )
              }
              className={`${
                collectuonActivityFilter.includes("bid") ? "active" : ""
              }`}
            >
              <i className="fa-light fa-megaphone"></i>
              Offers
            </div>
            <div
              onClick={() =>
                changeActivityFilter(
                  "transfer",
                  collectuonActivityFilter,
                  setCollectionActivityFilter
                )
              }
              className={`${
                collectuonActivityFilter.includes("transfer") ? "active" : ""
              }`}
            >
              <i className="fa-light fa-truck"></i>
              Transfers
            </div>
          </div>
          {/* <div className='collection-activity-filters-categories'>
          <div>
            List cancels
          </div>
          <div>
            Offer canecls
          </div>
        </div> */}
        </div>

        <div className="collection-activity-container">
          <div className="collection-activity-chart-container">
            <div className="chart-period-container">
              <Tabs
                tabs={periods.map(p => p.value)}
                active={chartPeriod}
                setTab={value => setChartPeriod(value)}
              />
            </div>
            <ActivityChart activityChartData={activityChartData} />
          </div>

          <div className="collection-activity-table-container">
            <table className="collection-activity-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th className="collection-activity-tr-item">Item</th>
                  <th>Price</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {collectionActivityLoading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="loading">
                        Loading activity{" "}
                        <svg
                          className="spinner"
                          width="65px"
                          height="65px"
                          viewBox="0 0 66 66"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="path"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            cx="33"
                            cy="33"
                            r="30"
                          ></circle>
                        </svg>{" "}
                      </div>
                    </td>
                  </tr>
                ) : (
                  collectionActivityMapping
                )}

                {loadingMoreActivity && (
                  <tr>
                    <td colSpan={6}>
                      <div className="loading">
                        Loading activity{" "}
                        <svg
                          className="spinner"
                          width="65px"
                          height="65px"
                          viewBox="0 0 66 66"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="path"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            cx="33"
                            cy="33"
                            r="30"
                          ></circle>
                        </svg>{" "}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Activity;
