import React, { useState } from "react";
import "./charts.css";

// import FloorListings from "./chart/floorListing/FloorListings"
import FloorPrice from "./chart/floorprice/FloorPrice";
import Volume from "./chart/volumes/Volume";
import Sales from "./chart/sales/Sales";
import Owners from "./chart/owners/Owners";
import Avgprice from "./chart/avgprice/Avgprice";
import Activelistings from "./chart/activeListings/Activelistings";
import Nftsperowner from "./chart/nftsperowner/Nftsperowner";
import Marketcap from "./chart/marketcap/Marketcap";
import Multiplechart from "./chart/multiplechart/Multiplechart";

const Charts = () => {
  const [chart, setChart] = useState("floorPrice");

  function changeChart(e) {
    document.querySelectorAll(".charts-name-container div").forEach(element => {
      element.classList.remove("active");
    });

    e.target.classList.add("active");

    setChart(e.target.id);
  }

  return (
    <>
      <div className="charts-name-container" onClick={e => changeChart(e)}>
        {/* <div id='floor/listings'>Floor/Listings</div> */}
            <div className="active" id="floorPrice">
              Floor price
        </div>
            <div id="volume">Volume</div>
            <div id="sales">Sales</div>
        <div id="owners">Owners</div>
            <div id="avgPrice">Avg. price</div>
            <div id="activeListings">Active listings</div>
        <div id="nftsPerOwner">Nfts per owner</div>
            <div id="marketCap">Market cap.</div>
            <div id="multipleChart">Multiple chart</div>
        </div>

      <SelectChart chart={chart} />
      </>
  );
};

const SelectChart = ({ chart }) => {
  // if(chart === "floor/listings"){
  //   return(
  //     <FloorListings />
  //   )
  // }
  if (chart === "floorPrice") {
    return <FloorPrice />;
  } else if (chart === "volume") {
    return <Volume />;
  } else if (chart === "sales") {
    return <Sales />;
  } else if (chart === "owners") {
    return <Owners />;
  } else if (chart === "avgPrice") {
    return <Avgprice />;
  } else if (chart === "activeListings") {
    return <Activelistings />;
  } else if (chart === "nftsPerOwner") {
    return <Nftsperowner />;
  } else if (chart === "marketCap") {
    return <Marketcap />;
  } else if (chart === "multipleChart") {
    return <Multiplechart />;
  }
};

export default Charts;
