import React, { useState, useEffect, useMemo } from "react";
import { baseUrl } from "@Variables";
import "./watchlist.css";

import { notFound } from "@Assets";

import times from "./times";

import { placeholderImage } from "@Utils/images";

import { LazyLoadImage } from "react-lazy-load-image-component";
import moment from "moment";
import { useFirstRender } from "@Hooks";

const WatchList = ({ tool, timeFrame, setTimeFrame, resetTime }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState({ name: "volume", type: "desc" });

  const firstRender = useFirstRender();

  useEffect(() => {
    resetTime("24H");
    setTimeFrame("24H");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);

  useEffect(() => {
    if (loading) {
      document.querySelector(".reloadIcon").classList.add("rotatingReloader");
    } else {
      document.querySelector(".reloadIcon").classList.remove("rotatingReloader");
    }
  }, [loading]);

  useEffect(() => {
    collections && sortData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    getWatchListCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame]);

  const time = times[timeFrame];

  async function getWatchListCollections() {
    try {
      if (firstRender && timeFrame !== "24H") return;

      setLoading(true);

      let collectionData = await fetch(`${baseUrl}/watchlistCollections`, {
        headers: {
          "COntent-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });
      collectionData = await collectionData.json();

      const { watchListCollections } = collectionData;

      sortData(watchListCollections);
      setLoading(false);
    } catch (err) {
      console.error(err);
      sortData([]);
      setLoading(false);
    }
  }

  function sortData(data) {
    let statsToSort;
    if (data) statsToSort = data;
    else statsToSort = collections;

    const { name, type } = sort;

    switch (name) {
      case "floor-price":
        const filteredFloor = statsToSort.sort((a, b) => {
          if (type === "asc") return a.floorAsk?.price?.amount?.decimal - b.floorAsk?.price?.amount?.decimal;
          else if (type === "desc") return b.floorAsk?.price?.amount?.decimal - a.floorAsk?.price?.amount?.decimal;
          return 0;
        });
        setCollections([...filteredFloor]);
        break;
      case "volume":
        const filteredVolume = statsToSort.sort((a, b) => {
          if (type === "asc") return a.volume[time] - b.volume[time];
          else if (type === "desc") return b.volume[time] - a.volume[time];
          return 0;
        });
        setCollections([...filteredVolume]);
        break;
      case "total-volume":
        const filteredTotalVolume = statsToSort.sort((a, b) => {
          if (type === "asc") return a.volume?.allTime - b.volume?.allTime;
          else if (type === "desc") return b.volume?.allTime - a.volume?.allTime;
          return 0;
        });
        setCollections([...filteredTotalVolume]);
        break;
      case "top-bid":
        const filteredTopBid = statsToSort.sort((a, b) => {
          if (type === "asc") return a.topBid?.price?.amount?.decimal - b.topBid?.price?.amount?.decimal;
          else if (type === "desc") return b.topBid?.price?.amount?.decimal - a.topBid?.price?.amount?.decimal;
          return 0;
        });
        setCollections([...filteredTopBid]);
        break;
      case "listings":
        const filteredListings = statsToSort.sort((a, b) => {
          if (type === "asc") return a.onSaleCount - b.onSaleCount;
          else if (type === "desc") return b.onSaleCount - a.onSaleCount;
          return 0;
        });
        setCollections([...filteredListings]);
        break;
      default:
        break;
    }
  }

  function changeSort(e, sortName) {
    const { name, type } = sort;
    let sortingType = "desc";

    if (name === sortName && type === "desc") sortingType = "asc";

    setArrows(e);
    setSort({ name: sortName, type: sortingType });
  }

  function setArrows(e) {
    document.querySelectorAll(".arrow").forEach(a => {
      if (e.currentTarget.children[1] === a) {
        return;
      }
      a.classList.remove("rotate");
      a.classList.remove("selected");
      a.previousElementSibling.classList.remove("nameSelected");
    });
    e.currentTarget.children[1].classList.add("selected");
    e.currentTarget.children[1].classList.toggle("rotate");
    e.currentTarget.children[1].previousElementSibling.classList.add("nameSelected");
  }

  const collectionsMapping = useMemo(
    () =>
      collections.map((collection, index) => {
        const { name, image, tokenCount, onSaleCount, createdAt } = collection;
        const volume = collection?.volume[time];
        const totalVolume = collection?.volume?.allTime;
        const contractAddress = collection?.id;
        const floorPrice = collection?.floorAsk?.price?.amount?.decimal;
        const bidValue = collection?.topBid?.price?.amount?.decimal;

        const creationDay = moment(createdAt).fromNow();
        return (
          <tr
            className="single-collection-container"
            key={index}
            onClick={() => window.open(`/collection/${contractAddress}`, "_blank")}
          >
            <td>
              <div className="image-name-container">
                <LazyLoadImage src={image} className="owned-image" effect="blur" placeholderSrc={placeholderImage} />

                <div className="minting-name-date">
                  <p className="watchlist-name">{name || "- - -"}</p>
                  <p className="watchlist-created-date">{creationDay}</p>
                </div>
              </div>
            </td>
            <td>
              <div className="owned-floor-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{floorPrice || "---"}</p>
              </div>
            </td>
            <td>
              <div className="owned-floor-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{volume || "---"}</p>
              </div>
            </td>
            <td>
              <div className="owned-floor-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{totalVolume || "---"}</p>
              </div>
            </td>
            <td>
              <div className="owned-floor-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{bidValue || "---"}</p>
              </div>
            </td>
            <td>
              <p>
                {onSaleCount} / {tokenCount}
              </p>
            </td>
          </tr>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collections]
  );

  return (
    <>
      <div className="table-container">
        <table cellSpacing={0} className="owned-container">
          <thead className="owned-details">
            <tr>
              <th>
                <div className="refresh">
                  <i onClick={getWatchListCollections} className="fa-solid fa-rotate reloadIcon"></i>
                </div>
                <p>Collection</p>
              </th>
              <th>
                <div onClick={e => changeSort(e, "floor-price")}>
                  <p>Floor price</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "volume")}>
                  <p className="nameSelected">Volume</p>
                  <i className="fa-solid fa-caret-down arrow selected rotate"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "total-volume")}>
                  <p>Total volume</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "top-bid")}>
                  <p>Top bid</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "listings")}>
                  <p>Listings/supply</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
            </tr>
            {loading && (
              <tr>
                <td colSpan={7}>
                  <div className="loading">
                    Loading data{" "}
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
          </thead>

          <tbody>
            {!loading && collections.length === 0 ? (
              <div className="watchlist-not-found">
                <img src={notFound} alt="" />
                <p>No collections found...</p>
              </div>
            ) : (
              collectionsMapping
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WatchList;
