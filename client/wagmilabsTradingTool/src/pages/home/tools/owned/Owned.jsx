import React, { useState, useEffect, useMemo } from "react";
import baseUrl from "../../../../variables/baseUrl";
import "./owned.css";
import times from "./times";

import notFound from "../../../../assets/notFound.svg";
import { placeholderImage } from "../../../../utils/images";

import { LazyLoadImage } from "react-lazy-load-image-component";

const Owned = ({ setTimeFrame, tool, timeFrame, resetTime }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState({ name: "owned", type: "desc" });

  useEffect(() => {
    resetTime("24H");
    setTimeFrame("24H");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);

  useEffect(() => {
    getOwnedCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame]);

  useEffect(() => {
    if (loading) {
      document.querySelector(".reloadIcon").classList.add("rotatingReloader");
    } else {
      document
        .querySelector(".reloadIcon")
        .classList.remove("rotatingReloader");
    }
  }, [loading]);

  useEffect(() => {
    collections && sortData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const time = times[timeFrame];

  async function getOwnedCollections() {
    try {
      setLoading(true);

      let data = await fetch(`${baseUrl}/ownedCollections`, {
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": localStorage.jsonwebtoken,
        },
      });
      data = await data.json();

      const { ownedCollections } = data;

      setTimeout(() => setLoading(false), 500);
      sortData(ownedCollections);
    } catch (err) {
      console.error(err);
      sortData([]);
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
          if (type === "asc")
            return a.collection?.floorAskPrice - b.collection?.floorAskPrice;
          else if (type === "desc")
            return b.collection?.floorAskPrice - a.collection?.floorAskPrice;
          return 0;
        });
        setCollections([...filteredFloor]);
        break;
      case "volume":
        const filteredVolume = statsToSort.sort((a, b) => {
          if (type === "asc")
            return a.collection?.volume[time] - b.collection?.volume[time];
          else if (type === "desc")
            return b.collection?.volume[time] - a.collection?.volume[time];
          return 0;
        });
        setCollections([...filteredVolume]);
        break;
      case "top-bid":
        const filteredBid = statsToSort.sort((a, b) => {
          if (type === "asc")
            return a.collection?.topBidValue - b.collection?.topBidValue;
          else if (type === "desc")
            return b.collection?.topBidValue - a.collection?.topBidValue;
          return 0;
        });
        setCollections([...filteredBid]);
        break;
      case "total-volume":
        const filteredTotalVolume = statsToSort.sort((a, b) => {
          if (type === "asc")
            return (
              a.collection?.volume?.allTime - b.collection?.volume?.allTime
            );
          else if (type === "desc")
            return (
              b.collection?.volume?.allTime - a.collection?.volume?.allTime
            );
          return 0;
        });
        setCollections([...filteredTotalVolume]);
        break;
      case "supply":
        const filteredSupply = statsToSort.sort((a, b) => {
          if (type === "asc")
            return a.collection?.tokenCount - b.collection?.tokenCount;
          else if (type === "desc")
            return b.collection?.tokenCount - a.collection?.tokenCount;
          return 0;
        });
        setCollections([...filteredSupply]);
        break;
      case "owned":
        const filteredOwned = statsToSort.sort((a, b) => {
          if (type === "asc")
            return a.ownership?.tokenCount - b.ownership?.tokenCount;
          else if (type === "desc")
            return b.ownership?.tokenCount - a.ownership?.tokenCount;
          return 0;
        });
        setCollections([...filteredOwned]);
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
    e.currentTarget.children[1].previousElementSibling.classList.add(
      "nameSelected"
    );
  }

  const collectionsMapping = useMemo(
    () =>
      collections.map((collection, index) => {
        const collectionData = collection.collection;
        const collectionOwnershipData = collection.ownership;

        const { name, image, floorAskPrice } = collectionData;

        const total_volume = collectionData?.volume?.allTime;
        const owned = collectionOwnershipData.tokenCount;
        const supply = collectionData.tokenCount;
        const address = collectionData?.id;
        const { topBidValue } = collectionData;

        const volume = collectionData?.volume[time];

        return (
          <tr
            key={index}
            className="single-collection-container"
            onClick={() => window.open(`/collection/${address}`, "_blank")}
          >
            <td className="image-name-container">
              <LazyLoadImage
                src={image}
                className="owned-image"
                effect="blur"
                placeholderSrc={placeholderImage}
              />
              <p className="owned-name">{name}</p>
            </td>
            <td>
              <div className="owned-floor-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{floorAskPrice || "---"}</p>
              </div>
            </td>
            <td>
              <div className="owned-volume filtered">
                <i className="fa-brands fa-ethereum"></i>
                <p>{volume || "---"}</p>
              </div>
            </td>
            <td>
              <div className="owned-market-cap">
                <i className="fa-brands fa-ethereum"></i>
                <p>{topBidValue || "- - -"}</p>
              </div>
            </td>
            <td>
              <div className="owned-total-volume">
                <i className="fa-brands fa-ethereum"></i>
                <p>{total_volume || "---"}</p>
              </div>
            </td>
            <td className="owned-total-sales">
              <p>{supply}</p>
            </td>
            <td className="owned-total-sales">
              <p>{owned}</p>
            </td>
          </tr>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collections]
  );

  return (
    <div className="table-container">
      <table cellSpacing={0} className="owned-container">
        <thead className="owned-details">
          <tr>
            <th>
              <div className="refresh">
                <i
                  className="fa-solid fa-rotate reloadIcon"
                  onClick={getOwnedCollections}
                ></i>
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
                <p>Volume</p>
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
              <div onClick={e => changeSort(e, "total-volume")}>
                <p>Total volume</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
              <div onClick={e => changeSort(e, "supply")}>
                <p>Supply</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
              <div onClick={e => changeSort(e, "owned")}>
                <p className="nameSelected">Owned</p>
                <i className="fa-solid fa-caret-down arrow selected rotate"></i>
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
  );
};

export default Owned;
