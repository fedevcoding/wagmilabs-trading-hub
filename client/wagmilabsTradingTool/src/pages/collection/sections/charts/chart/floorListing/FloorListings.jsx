import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useParams } from "react-router-dom";
import times from "../times";
import "./floorlisting.css";
import baseUrl from "../../../../../../baseUrl";

const FloorListings = () => {
  const params = useParams();

  Chart.register(...registerables);

  const [chartType, setChartType] = useState("bar");
  const [stats, setStats] = useState();
  const [newStats, setNewStats] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function chart() {
      try {
        setLoading(true);
        let listingsData = await fetch(
          `${baseUrl}/api/v1/wagmilabs/${params.id}/listed_count`,
          {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          }
        );
        listingsData = await listingsData.json();
        listingsData = listingsData.data;

        let floorPriceData = await fetch(
          `${baseUrl}/api/v1/wagmilabs/${params.id}/floor_price`,
          {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          }
        );
        floorPriceData = await floorPriceData.json();
        floorPriceData = floorPriceData.data;

        const parseDMY = s => {
          let [d, m, y, h] = s.split(/\D/);
          return new Date(y, m - 1, d, h);
        };

        listingsData.forEach((dat, index) => {
          const newDate = parseDMY(dat.timestamp);
          newDate.setFullYear(2022);
          dat["date_time_stamp"] = newDate;
        });

        floorPriceData.forEach((dat, index) => {
          const newDate = parseDMY(dat.timestamp);
          newDate.setFullYear(2022);
          dat["date_time_stamp"] = newDate;
        });

        setLoading(false);
        setStats({ listingsData, floorPriceData });
      } catch (err) {
        console.error(err);
        document.querySelector(".loadingChart").innerText =
          "Unable to load data, try again later.";
      }
    }
    chart();
  }, []);

  useEffect(() => {
    redrawPeriod("1d");
  }, [stats]);

  useEffect(() => {
    if (stats) {
      let fp = [];
      let listings = [];
      let dates = [];

      const usableStats = newStats ? newStats : stats;
      let options = { month: "long", day: "numeric", hour: "numeric" };

      usableStats.listingsData.forEach(listing => {
        listings.push(listing.listed_count);
      });

      usableStats.floorPriceData.forEach(price => {
        fp.push(price.floor_price);
        dates.push(
          price.date_time_stamp
            .toLocaleTimeString("en-GB", options)
            .replace(" at", "") + ":00"
        );
      });

      const ctx = document.querySelector(".floor-listing-chart");

      const data = {
        labels: dates,

        datasets: [
          {
            label: "Listing count",
            data: listings,
            backgroundColor: "#FF6633",
            hoverBackgroundColor: "rgb(193, 88, 88)",
            type: "bar",
            yAxisID: "listings",
            order: 2,
          },
          {
            tension: 0.5,
            label: "Floor Price",
            backgroundColor: "white",
            borderColor: "white",
            data: fp,
            pointRadius: 0,
            // pointBackgroundColor: "red",
            // pointBorderColor: "red",
            hoverPointRadius: 5,
            type: "line",
            yAxisID: "floorPrice",
            order: 1,
          },
        ],
      };

      // config
      const config = {
        data,
        options: {
          interaction: {
            mode: "index",
          },
          plugins: {
            tooltip: {
              intersect: false,
            },
            legend: {
              display: false,
            },
          },
          hover: {
            intersect: false,
          },
          scales: {
            listings: {
              beginAtZero: true,
              type: "linear",
              position: "left",
            },
            floorPrice: {
              beginAtZero: true,
              type: "linear",
              position: "right",
            },
          },
        },
      };

      const myChart = new Chart(ctx, config);
    }
  }, [chartType, newStats]);

  // function redrawType(e){
  //   document.querySelector(".chart").remove()
  //   let canvas = document.createElement('canvas')
  //   canvas.classList.add("chart");
  //   let container = document.querySelector(".containerChart").appendChild(canvas)

  //   setChartType(e)
  // }

  function redrawPeriod(e) {
    if (stats) {
      var seventhDay = new Date(
        new Date().getTime() - times[e] * 60 * 60 * 1000
      );

      var filteredListings = stats.listingsData.filter(d => {
        return d.date_time_stamp.getTime() >= seventhDay.getTime();
      });

      var filteredFloorPrice = stats.floorPriceData.filter(d => {
        return d.date_time_stamp.getTime() >= seventhDay.getTime();
      });

      document.querySelector(".floor-listing-chart").remove();
      let canvas = document.createElement("canvas");
      canvas.classList.add("floor-listing-chart");
      let container = document
        .querySelector(".floor-listing-containerChart")
        .appendChild(canvas);
      setNewStats({
        listingsData: filteredListings,
        floorPriceData: filteredFloorPrice,
      });
    }
  }

  return (
    <>
      <div className="chartSelectors">
        <div>
          <p>Chart type: </p>
          <select name="chartType" className="chartTypeSelect">
                <option value="bar">Line/Bars</option>
            <option value="line">Bars/Lines</option>
            </select>
          </div>

            <div>
            <p>Chart period: </p>
            <select
            name="period"
              className="chartTypeSelect"
            onChange={e => redrawPeriod(e.target.value)}
          >
              <option value="3h">3H</option>
            <option value="6h">6H</option>
              <option value="1d" selected>
                1D
            </option>
              <option value="3d">3D</option>
              <option value="7d">7D</option>
              <option value="14d">14D</option>
            <option value="30d">30D</option>
            <option value="60d">60D</option>
              <option value="90d">90D</option>
              <option value="all">ALL</option>
          </select>
        </div>

            <div>
          <p>Range: </p>
            <select name="range" className="chartTypeSelect">
            <option value="bar">30M</option>
              <option value="bar">1H</option>
            <option value="bar">3H</option>
            <option value="bar">6H</option>
              <option value="bar">12H</option>
              <option value="bar">1D</option>
          </select>
        </div>
        </div>

          <div className='floor-listing-containerChart'>
            {loading && (
        <p className="loadingChart">
              Loading...{" "}
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
            </svg>
          </p>
        )}
        <canvas className="floor-listing-chart"></canvas>
      </div>
      </>
  );
};

export default FloorListings;
