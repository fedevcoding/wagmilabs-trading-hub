import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { roundPrice2 } from "@Utils";
import moment from "moment";

const typeColors = {
  mint: "#4caf50",
  bought: "#2196f3",
  sold: "#f44336",
};

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
      formatter: function () {
        return `
            <b>NFT info:<b/>
            <br />
            Address: ${this.point.address}
            <br />
            Token ID: ${this.point.token_id}
            <br />
            Price: ${roundPrice2(this.y)} ETH
            <br />
            Date: ${moment(this.x).format("MMM DD, YYYY HH:mm")}
            <br />
            Type: ${this.point.type}
            `;
      },
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
            name: d.type,
            type: d.type,
            color: typeColors[d.type] || "#000000",
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
            name: d.type,
            type: d.type,
            color: typeColors[d.type] || "#000000",
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
            name: d.type,
            type: d.type,
            color: typeColors[d.type] || "#000000",
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
