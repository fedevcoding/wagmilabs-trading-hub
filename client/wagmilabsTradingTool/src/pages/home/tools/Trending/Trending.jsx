import React, { useEffect, useMemo, useRef, useState } from "react";
import { baseUrl } from "@Variables";
import "./trending.css";
import times from "./times";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useFirstRender } from "@Hooks";
import moment from "moment";

import { notFound } from "@Assets";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { placeholderImage } from "@Utils/images";
import { LoadingSpinner, TableLink } from "@Components";
import { PromoModal } from "../../../../components/Modals/PromoModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { WhatsNewModal } from "../../../../components/Modals/WhatsNewModal";

const defaultTimeFrame = "1H";

const whatsNewType = "whatsnew1";

const Trending = ({ tool, timeFrame, setTimeFrame, resetTime }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: whatsNewOpen, onOpen: openWhatsNew, onClose: closeWhatsNew } = useDisclosure();

  const firstRender = useFirstRender();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const time = times[timeFrame];
  const timeRef = useRef(time);

  const [sort, setSort] = useState({ name: "sales", type: "desc" });
  const sortRef = useRef(sort);

  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  useEffect(() => {
    if (firstRender && timeFrame !== defaultTimeFrame) return;
    timeRef.current = time;
    getTrending(true);
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
    const openedWhatsNew = localStorage.getItem(whatsNewType);

    if (openedWhatsNew) {
      onOpen();
    } else {
      openWhatsNew();
    }

    const refreshInterval = setInterval(getTrending, 5000);

    return () => {
      clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getTrending(loading) {
    try {
      if (!loading) loading = false;
      setLoading(loading);

      let data = await fetch(`${baseUrl}/trending/${timeRef.current}`, {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });
      data = await data.json();

      const { trendingCollections, time } = data;

      if (time === timeRef.current) sortData(trendingCollections);
    } catch (e) {
      sortData([]);
      console.log(e);
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
      case "sales":
        const filteredSales = statsToSort.sort((a, b) => {
          if (type === "asc") return a.rightSales - b.rightSales;
          else if (type === "desc") return b.rightSales - a.rightSales;
          return 0;
        });
        setStats([...filteredSales]);
        break;
      case "volume":
        const filteredVolume = statsToSort.sort((a, b) => {
          if (type === "asc") return a.volume - b.volume;
          else if (type === "desc") return b.volume - a.volume;
          return 0;
        });
        setStats([...filteredVolume]);
        break;
      case "supply":
        const filteredSupply = statsToSort.sort((a, b) => {
          if (type === "asc") return a.totalSupply - b.totalSupply;
          else if (type === "desc") return b.totalSupply - a.totalSupply;
          return 0;
        });
        setStats([...filteredSupply]);
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
        const { floor_price, image, contractAddress, name, totalSupply, creationDate } = stat;
        const sales = stat.rightSales;
        const volume = stat.volume;
        const { volumeStats } = stat;
        const { floorStats } = stat;

        const creationDay = moment(creationDate).fromNow();

        return (
          <TableLink
            to={`/collection/${contractAddress}`}
            // onClick={() => window.open(`/collection/${contractAddress}`, "_blank")}
            className="single-collection-container"
            key={index}
          >
            <td className="image-name-container">
              <LazyLoadImage src={image} className="trending-image" effect="blur" placeholderSrc={placeholderImage} />
              <div className="minting-name-date">
                <p className="trending-name">{name || "- - -"}</p>
                <p className="trending-created-date">{creationDay}</p>
              </div>
            </td>
            <td>
              <div className="trending-floor-price">
                <i className="fa-brands fa-ethereum"></i>
                <p>{floor_price}</p>
              </div>
            </td>
            <td className="trending-chart-floor-price">
              <div className="fp-chart">
                {floorStats && (
                  <HighchartsReact
                    className="chart"
                    highcharts={Highcharts}
                    options={{
                      series: [
                        {
                          name: "Floor price",
                          data: [floorStats["30day"] || 0, floorStats["7day"] || 0, floorStats["1day"] || 0],
                        },
                      ],
                      xAxis: {
                        categories: ["30 DAYS", "7 DAYS", "1 DAY"],
                        visible: false,
                      },
                      yAxis: {
                        visible: false,
                      },
                      legend: {
                        enabled: false,
                      },
                      title: {
                        text: "",
                      },
                      chart: {
                        type: "spline",
                        width: 160,
                        height: 80,
                        backgroundColor: "transparent",
                        borderRadius: 10,
                      },
                      tooltip: {
                        followPointer: true,
                        hideDelay: 200,
                        outside: true,
                      },
                    }}
                  />
                )}
              </div>
            </td>
            <td className="trending-sales filtered">
              <div className="trending-sales-pending">
                <p>{sales}</p>
              </div>
            </td>
            <td>
              <div className="trending-volume">
                <i className="fa-brands fa-ethereum"></i>
                <p>{Math.round(volume * 1000) / 1000}</p>
              </div>
            </td>
            <td className="trending-chart-volume">
              <div className="volume-chart">
                {volumeStats && volumeStats["1day"] && volumeStats["7day"] && volumeStats["30day"] ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      series: [
                        {
                          name: "Volume",
                          data: [volumeStats["1day"] || 0, volumeStats["7day"] || 0, volumeStats["30day"] || 0],
                          borderRadius: 5,
                        },
                      ],
                      xAxis: {
                        categories: ["1 DAY", "7 DAYS", "30 DAYS"],
                        visible: false,
                      },
                      yAxis: {
                        visible: false,
                      },
                      legend: {
                        enabled: false,
                      },
                      title: {
                        text: "",
                      },
                      chart: {
                        type: "column",
                        width: 160,
                        height: 80,
                        backgroundColor: "transparent",
                      },
                      tooltip: {
                        followPointer: true,
                        followTouchMove: true,
                        hideDelay: 200,
                        outside: true,
                      },
                    }}
                  />
                ) : (
                  <div className="no-data">
                    <p className="low-opacity">No data yet</p>
                  </div>
                )}
              </div>
            </td>
            <td className="trending-supply">
              <p>{totalSupply}</p>
            </td>
          </TableLink>
        );
      }),
    [stats]
  );

  return (
    <>
      <WhatsNewModal isOpen={whatsNewOpen} onClose={closeWhatsNew} type={whatsNewType} />
      <PromoModal isOpen={isOpen} onClose={onClose} />
      <div className="table-container">
        <table cellSpacing={0} className="trending-container">
          <thead className="trending-details">
            <tr>
              <th>
                <p>Collection</p>
              </th>
              <th>
                <div onClick={e => changeSort(e, "floor-price")}>
                  <p>Floor Price</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div>
                  <p>Floor chart</p>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "sales")}>
                  <p className="nameSelected">Sales</p>
                  <i className="fa-solid fa-caret-down arrow selected rotate"></i>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "volume")}>
                  <p>Volume</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
              <th>
                <div>
                  <p>Volume chart</p>
                </div>
              </th>
              <th>
                <div onClick={e => changeSort(e, "supply")}>
                  <p>Supply</p>
                  <i className="fa-solid fa-caret-down arrow"></i>
                </div>
              </th>
            </tr>
            {loading && (
              <tr>
                <td colSpan={7}>
                  <LoadingSpinner>
                    <p>Loading data</p>
                  </LoadingSpinner>
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {!loading && stats.length === 0 ? (
              <div className="trending-not-found">
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

export default Trending;
