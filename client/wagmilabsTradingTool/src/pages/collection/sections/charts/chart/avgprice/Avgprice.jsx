import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useParams } from "react-router-dom";
import times from "../times";
import baseUrl from "../../../../../../variables/baseUrl";

const Avgprice = () => {
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
        let data = await fetch(
          `${baseUrl}/api/v1/wagmilabs/${params.id}/one_avg_price`,
          {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          }
        );
        data = await data.json();
        data = data.data;

        const parseDMY = s => {
          let [d, m, y, h] = s.split(/\D/);
          return new Date(y, m - 1, d, h);
        };

        data.forEach((dat, index) => {
          const newDate = parseDMY(dat.timestamp);
          newDate.setFullYear(2022);
          dat["date_time_stamp"] = newDate;
        });
        setLoading(false);
        setStats(data);
      } catch (err) {
        console.error(err);
        document.querySelector(".loadingChart").innerText =
          "Unable to load data, try again later.";
      }
    }
    chart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    redrawPeriod("7d");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  useEffect(() => {
    if (stats) {
      let avgPrice = [];
      let dates = [];

      const usableStats = newStats ? newStats : stats;
      let options = { month: "long", day: "numeric", hour: "numeric" };

      usableStats.forEach(stat => {
        avgPrice.push(stat.one_avg_price);
        dates.push(
          stat.date_time_stamp
            .toLocaleTimeString("en-GB", options)
            .replace(" at", "") + ":00"
        );
      });

      const ctx = document.querySelector(".chart");

      // eslint-disable-next-line no-unused-vars
      const myChart = new Chart(ctx, {
        type: chartType,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Avg. price",
              data: avgPrice,
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 1,
            },
          ],
        },
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
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartType, newStats]);

  function redrawType(e) {
    document.querySelector(".chart").remove();
    let canvas = document.createElement("canvas");
    canvas.classList.add("chart");
    document.querySelector(".containerChart").appendChild(canvas);

    setChartType(e);
  }

  function redrawPeriod(e) {
    if (stats) {
      var seventhDay = new Date(
        new Date().getTime() - times[e] * 60 * 60 * 1000
      );

      var filteredData = stats.filter(d => {
        return d.date_time_stamp.getTime() >= seventhDay.getTime();
      });
      document.querySelector(".chart").remove();
      let canvas = document.createElement("canvas");
      canvas.classList.add("chart");
      document.querySelector(".containerChart").appendChild(canvas);
      setNewStats(filteredData);
    }
  }

  return (
    <>
      <div className="chartSelectors">
        <div>
          <p>Chart type: </p>
          <select
            name="chartType"
            className="chartTypeSelect"
            onChange={e => redrawType(e.target.value)}
          >
            <option value="bar">Bars</option>
            <option value="line">Lines</option>
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
            <option value="1d">1D</option>
            <option value="3d">3D</option>
            <option value="7d" selected>
              7D
            </option>
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
            <option value="one_day">1D</option>
          </select>
        </div>
      </div>

      <div className="containerChart">
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
        <canvas className="chart"></canvas>
      </div>
    </>
  );
};

export default Avgprice;
