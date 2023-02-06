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

    const fees = {
      OpenSea: "2.5%",
      X2Y2: "0.5%",
      Blur: "0",
      LooksRare: "2%",
      SudoSwap: "0.5%",
    };

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
                    {m.volumeEth}
                    <span className="low-opacity little-text"> ({m.volume.toLocaleString("EN-us")}$)</span>
                  </td>
                  <td>{m.saleNum}</td>
                  <td>{m.traderNum}</td>
                  <td>{fees[m.name]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
);
