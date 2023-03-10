import React, { useEffect, useState } from "react";
import Trending from "./tools/Trending/Trending";
import Minting from "./tools/Minting/Minting";
import Top100 from "./tools/Top100/Top100";
import rippleEffect from "@Utils/functions/rippleEffect";

import "./home.css";
import WatchList from "./tools/watchList/WatchList";
import Owned from "./tools/owned/Owned";
import { LivePulsing } from "@Components";

import { setPageTitle } from "@Utils";
import { PromoModal } from "@Components";
import { Select, useDisclosure } from "@chakra-ui/react";

const Home = () => {
  const [timeFrame, setTimeFrame] = useState("1H");
  const [tool, setTool] = useState("trending");

  const { isOpen, onOpen, onClose } = useDisclosure();

  function changeTime(e, time) {
    const element = e.currentTarget;
    document.querySelectorAll(".tool-times div").forEach(time => {
      time.classList.remove("active");
    });
    element.classList.add("active");

    setTimeFrame(time);
  }

  function resetTime(time) {
    document.querySelectorAll(".tool-times div").forEach(time => {
      time.classList.remove("active");
    });
    document.querySelector(`.${tool}-${time}`).classList.add("active");
  }

  function changeTool(e) {
    const element = e.currentTarget;
    rippleEffect(e);

    const currentTool = element.getAttribute("tool");

    if (tool !== currentTool) {
      document.querySelectorAll(".tool-times div").forEach(time => {
        time.classList.remove("active");
      });
      document.querySelectorAll(".tool-names div").forEach(time => {
        time.classList.remove("active");
      });
      element.classList.add("active");

      setTool(currentTool);
    }
  }

  useEffect(() => {
    const visitedTimes = parseInt(localStorage.getItem("visited")) || 0;
    const newVisited = visitedTimes + 1;
    localStorage.setItem("visited", newVisited);

    const clicked = localStorage.getItem("clickedPromoTwitter") || false;

    if (!clicked && (newVisited === 2 || newVisited % 4 === 0)) onOpen();
  }, [onOpen]);

  const isMobile = window.screen.width < 501;

  return (
    <>
      <section className="home-wrapper-section">
        <div className="info-container">
          <PromoModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} type={1} />
          {isMobile ? (
          <div style={{padding: '10px 0px'}}>
            <Select style={{ color: "white" }} placeholder='Select option' onChange={(e)=>setTool(e.target.value)} value={tool}>
              <option value='trending'>Trending</option>
              <option value='minting'>Minting</option>
              <option value='ranking'>Ranking</option>
              <option value='owned'>Owned</option>
              <option value='watchlist'>Watchlist</option>
            </Select>
          </div>
          ) : (
            <div className="tool-names">
            <div onClick={e => changeTool(e)} className="active home-trending-section" tool="trending">
              Trending <LivePulsing />
            </div>
            <div onClick={e => changeTool(e)} className="home-minting-section" tool="minting">
              Minting <LivePulsing />
            </div>
            <div onClick={e => changeTool(e)} className="home-ranking-section" tool="ranking">
              Ranking <LivePulsing />
            </div>
            <div onClick={e => changeTool(e)} className="home-minting-section" tool="owned">
              Owned
            </div>
            <div onClick={e => changeTool(e)} className="home-minting-section" tool="watchlist">
              WatchList
            </div>
          </div>
          )}
          <div className="tool-times">
            <Times tool={tool} rippleEffect={rippleEffect} changeTime={changeTime} />
          </div>
        </div>

        <Tool tool={tool} timeFrame={timeFrame} setTimeFrame={setTimeFrame} resetTime={resetTime} />
      </section>
    </>
  );
};

const Tool = ({ tool, timeFrame, setTimeFrame, resetTime }) => {
  switch (tool) {
    case "trending":
      setPageTitle("Trending | Wagmi Labs");
      return <Trending timeFrame={timeFrame} tool={tool} setTimeFrame={setTimeFrame} resetTime={resetTime} />;
    case "minting":
      setPageTitle("Minting | Wagmi Labs");
      return <Minting timeFrame={timeFrame} tool={tool} setTimeFrame={setTimeFrame} resetTime={resetTime} />;
    case "ranking":
      setPageTitle("Ranking | Wagmi Labs");
      return <Top100 timeFrame={timeFrame} tool={tool} setTimeFrame={setTimeFrame} resetTime={resetTime} />;
    case "owned":
      setPageTitle("Owned | Wagmi Labs");
      return <Owned timeFrame={timeFrame} tool={tool} setTimeFrame={setTimeFrame} resetTime={resetTime} />;
    case "watchlist":
      setPageTitle("Watchlist | Wagmi Labs");
      return <WatchList timeFrame={timeFrame} tool={tool} setTimeFrame={setTimeFrame} resetTime={resetTime} />;
    default:
      break;
  }
};

const Times = ({ tool, changeTime }) => {
  switch (tool) {
    case "trending":
      return (
        <>
          <div className="trending-1M" onClick={e => changeTime(e, "1M")}>
            1M
          </div>
          <div className="trending-5M" onClick={e => changeTime(e, "5M")}>
            5M
          </div>
          <div className="trending-10M" onClick={e => changeTime(e, "10M")}>
            10M
          </div>
          <div className="trending-30M" onClick={e => changeTime(e, "30M")}>
            30M
          </div>
          <div className="trending-1H" onClick={e => changeTime(e, "1H")}>
            1H
          </div>
          <div className="trending-4H" onClick={e => changeTime(e, "4H")}>
            4H
          </div>
          <div className="trending-12H" onClick={e => changeTime(e, "12H")}>
            12H
          </div>
          <div className="trending-1D" onClick={e => changeTime(e, "1D")}>
            1D
          </div>
          <div className="trending-7D" onClick={e => changeTime(e, "7D")}>
            7D
          </div>
        </>
      );
    case "minting":
      return (
        <>
          <div className="minting-1M" onClick={e => changeTime(e, "1M")}>
            1M
          </div>
          <div className="minting-2M" onClick={e => changeTime(e, "2M")}>
            2M
          </div>
          <div className="minting-5M" onClick={e => changeTime(e, "5M")}>
            5M
          </div>
          <div className="minting-15M" onClick={e => changeTime(e, "15M")}>
            15M
          </div>
          <div className="minting-30M" onClick={e => changeTime(e, "30M")}>
            30M
          </div>
          <div className="minting-1H" onClick={e => changeTime(e, "1H")}>
            1H
          </div>
          <div className="minting-6H" onClick={e => changeTime(e, "6H")}>
            6H
          </div>
          <div className="minting-1D" onClick={e => changeTime(e, "1D")}>
            1D
          </div>
        </>
      );
    case "ranking":
      return (
        <>
          <div className="ranking-1M" onClick={e => changeTime(e, "1M")}>
            1M
          </div>
          <div className="ranking-5M" onClick={e => changeTime(e, "5M")}>
            5M
          </div>
          <div className="ranking-10M" onClick={e => changeTime(e, "10M")}>
            10M
          </div>
          <div className="ranking-30M" onClick={e => changeTime(e, "30M")}>
            30M
          </div>
          <div className="ranking-1H" onClick={e => changeTime(e, "1H")}>
            1H
          </div>
          <div className="ranking-4H" onClick={e => changeTime(e, "4H")}>
            4H
          </div>
          <div className="ranking-12H" onClick={e => changeTime(e, "12H")}>
            12H
          </div>
          <div className="ranking-1D" onClick={e => changeTime(e, "1D")}>
            1D
          </div>
          <div className="ranking-7D" onClick={e => changeTime(e, "7D")}>
            7D
          </div>
        </>
      );
    case "owned":
      return (
        <>
          <div className="owned-24H" onClick={e => changeTime(e, "24H")}>
            24H
          </div>
          <div className="owned-7D" onClick={e => changeTime(e, "7D")}>
            7D
          </div>
          <div className="owned-30D" onClick={e => changeTime(e, "30D")}>
            30D
          </div>
        </>
      );
    case "watchlist":
      return (
        <>
          <div className="watchlist-24H" onClick={e => changeTime(e, "24H")}>
            24H
          </div>
          <div className="watchlist-7D" onClick={e => changeTime(e, "7D")}>
            7D
          </div>
          <div className="watchlist-30D" onClick={e => changeTime(e, "30D")}>
            30D
          </div>
        </>
      );
    default:
      break;
  }
};

export default Home;
