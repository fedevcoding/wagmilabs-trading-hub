import React, { useEffect, useState, useRef } from "react";
import { Tabs } from "@Components";
import {
  ActivityChart,
  CollectionActivityMapping,
  LoadingMoreActivity,
} from "./Components";
import {
  changeActivityFilter,
  getActivityData,
  getChartData,
  getMoreActivity,
  periods,
} from "./functions";

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
                  <LoadingMoreActivity />
                ) : (
                  <CollectionActivityMapping
                    collectionActivity={collectionActivity}
                    address={address}
                  />
                )}

                {loadingMoreActivity && <LoadingMoreActivity />}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Activity;
