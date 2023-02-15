import React, { useEffect, useMemo, useState, useRef } from "react";
import { baseUrl } from "@Variables";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {
  formatAddress3,
  roundPrice2,
} from "../../../../utils/formats/formats.js";

import "./activity.css";
import moment from "moment";
import getMarketplaceImage from "../../../../utils/marketplaceImageMapping.js";
import { Tabs } from "@Components";

const periods = ["24h", "7d", "30d", "3M", "1y", "all"].map(p => ({
  value: p,
  label: p,
}));

const activityTypeMapping = {
  ask: "List",
  sale: "Sale",
  transfer: "Transfer",
  mint: "Mint",
  bid: "Offer",
  bid_cancel: "Offer Cancel",
  ask_cancel: "List Cancel",
};

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
        getMoreActivity();
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
    getChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartPeriod]);

  useEffect(() => {
    getActivityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectuonActivityFilter]);

  async function getChartData() {
    setLoadingChart(true);

    let data = await fetch(`${baseUrl}/activityChart/${address}`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken,
      },
    });

    data = await data.json();

    const averagePrices = data
      .map(item => roundPrice2(item.averageprice))
      .reverse();
    const volumes = data.map(item => roundPrice2(item.volume)).reverse();
    const days = data
      .map(item => moment(item.day).format("DD/MM/YYYY"))
      .reverse();
    const sales = data.map(item => item.sales).reverse();

    setActivityChartData({
      averagePrices: averagePrices,
      volumes: volumes,
      sales,
      days,
    });
    setLoadingChart(false);
  }

  async function getActivityData() {
    try {
      setCollectionActivityLoading(true);

      const filters = collectuonActivityFilter.join("-");

      let data = await fetch(
        `${baseUrl}/collectionActivity/${address}?types=${filters}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );
      if (!data.ok) throw new Error("Error getting activity data");
      data = await data.json();

      const { continuation, activities } = data;

      activityContinuation.current = continuation;

      setCollectionActivity(activities);
      setCollectionActivityLoading(false);
    } catch (e) {
      console.log(e);
      activityContinuation.current = null;
      setCollectionActivity([]);
      setCollectionActivityLoading(false);
    }
  }
  async function getMoreActivity() {
    try {
      setLoadingMoreActivity(true);

      const filters = collectuonActivityFilter.join("-");
      const continuationFilter = activityContinuation.current
        ? `&continuation=${activityContinuation.current}`
        : "";

      let data = await fetch(
        `${baseUrl}/collectionActivity/${address}?types=${filters}${continuationFilter}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );
      if (!data.ok) throw new Error("Error getting activity data");
      data = await data.json();

      const { continuation, activities } = data;

      activityContinuation.current = continuation;

      setCollectionActivity(prev => [...prev, ...activities]);
      setCollectionActivityLoading(false);
    } catch (e) {
      console.log(e);
      activityContinuation.current = null;
      setCollectionActivityLoading(false);
    }
  }

  function changeActivityFilter(type) {
    if (collectuonActivityFilter.includes(type)) {
      const newFilter = collectuonActivityFilter.filter(item => item !== type);
      setCollectionActivityFilter(newFilter);
    } else {
      setCollectionActivityFilter([...collectuonActivityFilter, type]);
    }
  }

  const collectionActivityMapping = useMemo(
    () =>
      collectionActivity.map((item, index) => {
        const { type, fromAddress, toAddress, price, timestamp } = item;
        const { tokenName, tokenImage } = item.token;
        const { collectionName, collectionImage } = item.collection;

        const activityType = activityTypeMapping[type];

        const marketplaceName = item?.order?.source?.name;
        const marketplaceImage = getMarketplaceImage(marketplaceName);
        const isLast = index === collectionActivity.length - 1;
        const key = crypto.randomUUID();
        return (
          <>
            <tr
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
                {moment(timestamp * 1000).fromNow()}
              </td>
            </tr>

            <tr className="collection-activity-single-hr">
              <td colSpan={6}>
                <hr></hr>
              </td>
            </tr>
          </>
        );
      }),
    [collectionActivity]
  );

  return (
    <>
      <hr className="collection-activity-hr" />
      <div className="collection-activity-section">
        <div className="collection-activity-filters-container">
          <p>CATEGORY</p>

          <div className="collection-activity-filters-categories">
            <div
              onClick={() => changeActivityFilter("sale")}
              className={`${
                collectuonActivityFilter.includes("sale") ? "active" : ""
              }`}
            >
              <i className="fa-light fa-bag-shopping"></i>
              Sales
            </div>
            <div
              onClick={() => changeActivityFilter("ask")}
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
              onClick={() => changeActivityFilter("bid")}
              className={`${
                collectuonActivityFilter.includes("bid") ? "active" : ""
              }`}
            >
              <i className="fa-light fa-megaphone"></i>
              Offers
            </div>
            <div
              onClick={() => changeActivityFilter("transfer")}
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

const ActivityChart = ({ activityChartData }) => {
  return (
    <div className="activity-chart-wrapper">
      <HighchartsReact
        className="activity-chart"
        highcharts={Highcharts}
        options={{
          series: [
            {
              type: "column",
              name: "Volume",
              data: activityChartData?.volumes,
              yAxis: 1,
            },
            {
              type: "spline",
              name: "Average price",
              data: activityChartData?.averagePrices,
            },
          ],
          xAxis: {
            categories: activityChartData?.days,
          },
          yAxis: [
            {
              title: {
                text: "Avg. price",
              },
              resize: {
                enabled: true,
              },
            },
            {
              title: {
                text: "ETH volume",
              },
              opposite: true,
            },
          ],
          legend: {},
          title: {
            text: "",
          },
          chart: {
            type: "spline",
            backgroundColor: "transparent",
            borderRadius: 10,
          },
          tooltip: {
            shared: true,

            // formatter: function () {
            //   return this.points.reduce(function (s, point) {
            //     return s + '<br/>' + point.series.name + ': ' + point.y + 'm';
            //   }, '<b>' + this.x + '</b>');
            // },

            // followPointer: true,
            hideDelay: 200,
            outside: false,
          },
        }}
      />
    </div>
  );
};

const ActivityIcon = ({ type }) => {
  return (
    <>
      {(() => {
        switch (type) {
          case "sale":
            return <i className="fa-light fa-bag-shopping"></i>;
          case "ask":
            return <i className="fa-light fa-tag"></i>;
          case "bid":
            return <i className="fa-light fa-megaphone"></i>;
          case "transfer":
            return <i className="fa-light fa-truck"></i>;
          default:
            return <i className="fa-solid fa-question"></i>;
        }
      })()}
    </>
  );
};
