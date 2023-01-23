import React from "react";
import getMarketplaceImage from "../../../../../../utils/marketplaceImageMapping";
import { LoadingSpinner, Tabs } from "../../../../../utility-components";
import { useGetLeaderBoard } from "./useGetLeaderBoard";

export const LeaderBoard = React.memo(
  ({ leaderBoard, period, marketplaces }) => {
    const periods = ["24h", "7d", "30d", "3M", "1y", "all"].map(p => ({
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
        <div className="leader-board-header">
          <h2>Leader board</h2>
          <Tabs
            tabs={periods.map(p => p.value)}
            active={currentPeriod}
            setTab={value => setPeriod(value)}
          />
        </div>
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
