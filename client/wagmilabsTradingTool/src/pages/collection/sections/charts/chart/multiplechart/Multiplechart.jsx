import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useParams } from "react-router-dom";
import times from "../times";
import { baseUrl } from "@Variables";
import apiEndUrl from "./apiEndUrl";

const Multiplechart = () => {
  const params = useParams();

  Chart.register(...registerables);

  const [chartType] = useState("bar");
  const [chartsTypes, setChartsTypes] = useState({
    apiEndOne: "floorPrice",
    apiEndTwo: "owners",
  });
  const [stats, setStats] = useState();
  const [newStats, setNewStats] = useState();
  const [loading] = useState(false);

  useEffect(() => {
    async function chart() {
      try {
        let chartsOneData = await fetch(
          `${baseUrl}/api/v1/wagmilabs/${params.id}/${
            apiEndUrl[chartsTypes.apiEndOne]
          }`,
          {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          }
        );
        chartsOneData = await chartsOneData.json();
        chartsOneData = chartsOneData.data;

        let chartsTwoData = await fetch(
          `${baseUrl}/api/v1/wagmilabs/${params.id}/${
            apiEndUrl[chartsTypes.apiEndTwo]
          }`,
          {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          }
        );
        chartsTwoData = await chartsTwoData.json();
        chartsTwoData = chartsTwoData.data;

        const parseDMY = s => {
          let [d, m, y, h] = s.split(/\D/);
          return new Date(y, m - 1, d, h);
        };

        chartsOneData.forEach((dat, index) => {
          const newDate = parseDMY(dat.timestamp);
          newDate.setFullYear(2022);
          dat["date_time_stamp"] = newDate;
        });

        chartsTwoData.forEach((dat, index) => {
          const newDate = parseDMY(dat.timestamp);
          newDate.setFullYear(2022);
          dat["date_time_stamp"] = newDate;
        });

        //   setLoading(false)
        setStats({ chartsOneData, chartsTwoData });
      } catch (err) {
        console.error(err);
        document.querySelector(".loadingChart").innerText =
          "Unable to load data, try again later.";
      }
    }
    chart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartsTypes]);

  useEffect(() => {
    const period = document.querySelector(".chartPeriodSelect").value;
    redrawPeriod(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  useEffect(() => {
    if (stats) {
      let chartOne = [];
      let chartTwo = [];
      let dates = [];

      const usableStats = newStats ? newStats : stats;
      let options = { month: "long", day: "numeric", hour: "numeric" };

      usableStats.chartsOneData.forEach(stat => {
        chartOne.push(stat[apiEndUrl[chartsTypes.apiEndOne]]);
        dates.push(
          stat.date_time_stamp
            .toLocaleTimeString("en-GB", options)
            .replace(" at", "") + ":00"
        );
      });

      usableStats.chartsTwoData.forEach(stat => {
        chartTwo.push(stat[apiEndUrl[chartsTypes.apiEndTwo]]);
      });

      const ctx = document.querySelector(".multiple-chart");

      const label1 = document.querySelector(".chartOneSelect").value;
      const label2 = document.querySelector(".chartTwoSelect").value;

      const data = {
        labels: dates,

        datasets: [
          {
            label: label1,
            data: chartOne,
            backgroundColor: "#FF6633",
            hoverBackgroundColor: "rgb(193, 88, 88)",
            type: "bar",
            yAxisID: "chartOne",
            order: 2,
          },
          {
            tension: 0.5,
            label: label2,
            backgroundColor: "white",
            borderColor: "white",
            data: chartTwo,
            pointRadius: 0,
            // pointBackgroundColor: "red",
            // pointBorderColor: "red",
            hoverPointRadius: 5,
            type: "line",
            yAxisID: "chartTwo",
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
            chartTwo: {
              beginAtZero: false,
              type: "linear",
              position: "left",
            },
            chartOne: {
              beginAtZero: false,
              type: "linear",
              position: "right",
            },
          },
        },
      };

      // eslint-disable-next-line no-unused-vars
      const myChart = new Chart(ctx, config);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartType, newStats]);

  function redrawTypeCharts() {
    document.querySelector(".multiple-chart").remove();
    let canvas = document.createElement("canvas");
    canvas.classList.add("multiple-chart");
    document.querySelector(".multiple-containerChart").appendChild(canvas);

    const apiEndOne = document.querySelector(".chartOneSelect").value;
    const apiEndTwo = document.querySelector(".chartTwoSelect").value;

    setChartsTypes({ apiEndOne, apiEndTwo });
  }

  function redrawPeriod(e) {
    if (stats) {
      var seventhDay = new Date(
        new Date().getTime() - times[e] * 60 * 60 * 1000
      );

      var filteredChartOneData = stats.chartsOneData.filter(d => {
        return d.date_time_stamp.getTime() >= seventhDay.getTime();
      });

      var filteredChartTwoData = stats.chartsTwoData.filter(d => {
        return d.date_time_stamp.getTime() >= seventhDay.getTime();
      });

      document.querySelector(".multiple-chart").remove();
      let canvas = document.createElement("canvas");
      canvas.classList.add("multiple-chart");
      // eslint-disable-next-line no-unused-vars
      let container = document
        .querySelector(".multiple-containerChart")
        .appendChild(canvas);
      setNewStats({
        chartsOneData: filteredChartOneData,
        chartsTwoData: filteredChartTwoData,
      });
    }
  }

  return (
    <>
      <div className="chartSelectors">
        <div>
          <p>Chart one: </p>
          <select
            name="chartType"
            className="chartOneSelect"
            onChange={redrawTypeCharts}
          >
            <option value="floorPrice">Floor price</option>
            <option value="volume">Volume</option>
            <option value="sales">Sales</option>
            <option value="owners">Owners</option>
            <option value="averagePrice">Average price</option>
            <option value="activeListings">Active listings</option>
            <option value="nftsPerOwner">Nfts per owner</option>
            <option value="marketCap">Market cap</option>
          </select>
        </div>

        <div>
          <p>Chart two: </p>
          <select
            name="chartType"
            className="chartTwoSelect"
            onChange={redrawTypeCharts}
          >
            <option value="floorPrice">Floor price</option>
            <option value="volume">Volume</option>
            <option value="sales">Sales</option>
            <option selected value="owners">
              Owners
            </option>
            <option value="averagePrice">Average price</option>
            <option value="activeListings">Active listings</option>
            <option value="nftsPerOwner">Nfts per owner</option>
            <option value="marketCap">Market cap</option>
          </select>
        </div>

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
            className="chartPeriodSelect"
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

      <div className="multiple-containerChart">
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
        <canvas className="multiple-chart"></canvas>
      </div>
    </>
  );
};

export default Multiplechart;
