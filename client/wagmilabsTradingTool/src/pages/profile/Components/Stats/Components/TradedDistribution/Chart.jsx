import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { roundPrice2 } from "@Utils";
import moment from "moment";

function Chart({ data }) {
  const options = {
    chart: {
      type: "scatter",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Timestamp",
      },
    },
    title: false,
    yAxis: {
      title: {
        text: "Price",
      },
    },
    tooltip: {
      pointFormat: `
        <div>
          <p>{point.readableDate}</p>
          <br />
          <p>Address: {point.address}</p>
          <br />
          <p>Price: {point.price} ETH</p>
          <br />
          <p>Token ID: {point.token_id}</p>
        </div>`,
    },
    series: [
      {
        name: "Mint",
        data: data
          .filter(d => d.type === "mint")
          .map(d => ({
            x: new Date(d.timestamp).getTime(),
            y: d.price,
            address: d.address,
            token_id: d.token_id,
            readableDate: moment(d.timestamp).format("MMM DD, YYYY HH:mm"),
            price: roundPrice2(d.price),
          })),
        marker: {
          radius: 3,
        },
      },
      {
        name: "Bought",
        data: data
          .filter(d => d.type === "bought")
          .map(d => ({
            x: new Date(d.timestamp).getTime(),
            y: d.price,
            address: d.address,
            token_id: d.token_id,
            readableDate: moment(d.timestamp).format("MMM DD, YYYY HH:mm"),
            price: roundPrice2(d.price),
          })),
        marker: {
          radius: 3,
        },
      },
      {
        name: "Sold",
        data: data
          .filter(d => d.type === "sold")
          .map(d => ({
            x: new Date(d.timestamp).getTime(),
            y: d.price,
            address: d.address,
            token_id: d.token_id,
            readableDate: moment(d.timestamp).format("MMM DD, YYYY HH:mm"),
            price: roundPrice2(d.price),
          })),
        marker: {
          radius: 3,
        },
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default Chart;
