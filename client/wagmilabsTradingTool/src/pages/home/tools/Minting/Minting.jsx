import React, { useEffect, useState, useMemo, useRef } from "react";
import "./minting.css";
import times from "./times";
import { baseUrl } from "@Variables";

import { notFound } from "@Assets";

import { roundPrice } from "@Utils/formats/formats";

import moment from "moment";
import { useFirstRender } from "@Hooks";
import { placeholderImage } from "@Utils/images";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { LoadingSpinner } from "@Components";

const defaultTimeFrame = "1H";

const Minting = ({ tool, timeFrame, setTimeFrame, resetTime }) => {
  const firstRender = useFirstRender();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const time = times[timeFrame];
  const timeRef = useRef(time);

  const [sort, setSort] = useState({ name: "right-mints", type: "desc" });
  const sortRef = useRef(sort);

  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  useEffect(() => {
    if (firstRender && timeFrame !== defaultTimeFrame) return;
    timeRef.current = time;
    getMinting(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame]);

  useEffect(() => {
    resetTime(defaultTimeFrame);
    setTimeFrame(defaultTimeFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);

  useEffect(() => {
    stats && sortData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // refresh interval
  useEffect(() => {
    const refreshInterval = setInterval(getMinting, 5000);

    return () => {
      clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getMinting(loading) {
    try {
      if (!loading) loading = false;
      setLoading(loading);

      let data = await fetch(`${baseUrl}/minting/${timeRef.current}`, {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });
      data = await data.json();

      const { mintingCollections, time } = data;

      if (timeRef.current === time) sortData(mintingCollections);
    } catch (e) {
      console.log(e);
      sortData([]);
    }
  }

  function sortData(data) {
    let statsToSort;
    if (data) statsToSort = data;
    else statsToSort = stats;

    const { name, type } = sortRef.current;

    switch (name) {
      case "floor-price":
        const filteredFloor = statsToSort.sort((a, b) => {
          if (type === "asc") return a.floor_price - b.floor_price;
          else if (type === "desc") return b.floor_price - a.floor_price;
          return 0;
        });
        setStats([...filteredFloor]);
        break;
      case "mint-price":
        const filteredMintPrice = statsToSort.sort((a, b) => {
          if (type === "asc") return a.mintPrice - b.mintPrice;
          else if (type === "desc") return b.mintPrice - a.mintPrice;
          return 0;
        });
        setStats([...filteredMintPrice]);
        break;
      case "mint-volume":
        const filteredMintVolume = statsToSort.sort((a, b) => {
          if (type === "asc") return a.volume - b.volume;
          else if (type === "desc") return b.volume - a.volume;
          return 0;
        });
        setStats([...filteredMintVolume]);
        break;
      case "right-mints":
        const filteredRightMints = statsToSort.sort((a, b) => {
          if (type === "asc") return a.rightMints - b.rightMints;
          else if (type === "desc") return b.rightMints - a.rightMints;
          return 0;
        });
        setStats([...filteredRightMints]);
        break;
      case "unique-minters":
        const filteredUniqueMinters = statsToSort.sort((a, b) => {
          if (type === "asc") return a.uniqueMinters - b.uniqueMinters;
          else if (type === "desc") return b.uniqueMinters - a.uniqueMinters;
          return 0;
        });
        setStats([...filteredUniqueMinters]);
        break;
      case "total-mints":
        const filteredTotalMints = statsToSort.sort((a, b) => {
          if (type === "asc") return a.totalMints - b.totalMints;
          else if (type === "desc") return b.totalMints - a.totalMints;
          return 0;
        });
        setStats([...filteredTotalMints]);
        break;
      default:
        break;
    }

    data && setLoading(false);
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

  const mappedStats = useMemo(
    () =>
      stats.map((stat, index) => {
        const {
          creationDate,
          image,
          contractAddress,
          name,
          totalMints,
          uniqueMinters,
          volume,
          floor_price,
          mintPrice,
          rightMints,
        } = stat;

        const creationDay = moment(creationDate).fromNow();

        return (
          <tr
            onClick={() => window.open(`/collection/${contractAddress}`, "_blank")}
            className="single-collection-container"
            key={index}
          >
            <td className="image-name-container">
              <LazyLoadImage src={image} className="minting-image" effect="blur" placeholderSrc={placeholderImage} />
              <div className="minting-name-date">
                <p className="minting-name">{name || "- - -"}</p>
                <p className="minting-created-date">{creationDay}</p>
              </div>
            </td>
            <td>
              <div className="minting-mint-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{mintPrice ? roundPrice(mintPrice) : 0}</p>
              </div>
            </td>
            <td className="minting-chart-floor-price">
              <div className="minting-floor-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{floor_price ? roundPrice(floor_price) : 0}</p>
              </div>
            </td>
            <td className="minting-sales filtered">
              <div className="minting-right-mints">{rightMints || "- - -"}</div>
            </td>
            <td>
              <div className="minting-volume">
                <i className="fa-brands fa-ethereum"></i>
                <p>{volume ? roundPrice(volume) : 0}</p>
              </div>
            </td>
            <td className="minting-chart-mint">
              <div className="mint-chart">
                <p className="low-opacity little-text">Coming soon</p>
              </div>
            </td>
            <td className="minting-unique-minters">
              <p>{uniqueMinters || "- - -"}</p>
            </td>
            <td className="minting-total-mints">
              <p>{totalMints || "- - -"}</p>
            </td>
          </tr>
        );
      }),
    [stats]
  );

  return (
    <>
      <div className="table-container">
        <table cellSpacing={0} className="minting-container">
          <thead className="minting-details">
            <tr>
              <th>
                <p>Collection</p>
              </th>
              <th>
                <div onClick={e => changeSort(e, "mint-price")}>
                  <p>Mint price</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "floor-price")}>
                  <p>Floor price</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "right-mints")}>
                  <p className="nameSelected">Mints</p>
                  <i className="fa-solid fa-caret-down arrow selected rotate"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "mint-volume")}>
                  <p>Mint volume</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div>
                  <p>Mint trend</p>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "unique-minters")}>
                  <p>Unique minters</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "total-mints")}>
                  <p>Total mints</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
            </tr>
            {loading && (
              <tr>
                <td colSpan={8}>
                  <LoadingSpinner>
                    <p>Loading data</p>
                  </LoadingSpinner>
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {!loading && stats.length === 0 ? (
              <div className="watchlist-not-found">
                <img src={notFound} alt="" />
                <p>No collections found...</p>
              </div>
            ) : (
              mappedStats
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Minting;
