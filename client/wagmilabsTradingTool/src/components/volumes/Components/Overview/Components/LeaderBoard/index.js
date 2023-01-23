import React from "react";
import getMarketplaceImage from "../../../../../../utils/marketplaceImageMapping";
import { LoadingSpinner, Select } from "../../../../../utility-components";
import { useGetLeaderBoard } from "./useGetLeaderBoard";

export const LeaderBoard = React.memo(
  ({ leaderBoard, period, marketplaces }) => {
    const periods = ["24H", "7D", "30D", "3M", "1Y", "All"].map(p => ({
      value: p,
      label: p,
    }));

    const [currentPeriod, setPeriod] = React.useState(period);
    const [l, isLoading] = useGetLeaderBoard(
      leaderBoard,
      period,
      currentPeriod,
      marketplaces
    );

    return (
      <div className="leader-board">
        <Select
          options={periods}
          value={periods.find(p => p.value === currentPeriod)}
          className="select-period"
          onChange={value => setPeriod(value.value)}
        />
        <h2>Leader board</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Marketplace</th>
                <th>Volume ETH</th>
                <th>Sales</th>
                <th>Traders</th>
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {l.map(m => (
                <tr key={m.name}>
                  <td className="market-name">
                    <img
                      width={30}
                      src={getMarketplaceImage(m.name)}
                      alt={m.name}
                    />
                    {m.name}
                  </td>
                  <td>
                    {m.volumeEth.toFixed(2) +
                      " (" +
                      parseInt(m.volume).toLocaleString("EN-us") +
                      "$)"}
                  </td>
                  <td>{m.saleNum}</td>
                  <td>{m.traderNum}</td>
                  <td>{m.feeRateList[0].minValue}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
);
