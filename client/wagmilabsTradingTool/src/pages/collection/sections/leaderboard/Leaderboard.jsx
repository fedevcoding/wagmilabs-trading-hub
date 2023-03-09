import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { Card, LoadingSpinner, Select } from "@Components";
import { formatAddress, roundPrice2, roundPriceUsd } from "@Utils";
import { useGetData } from "./useGetData";
import { useCopy } from "@Hooks";

import "./style.scss";
import { getDirections, getListSort } from "./functions";

const Leaderboard = React.memo(({ address }) => {
  console.log("address", address);
  const listSort = getListSort();
  const [sort, setSort] = React.useState(listSort[9]);
  const listDirections = getDirections();
  const [direction, setDirecton] = React.useState(listDirections[1]);
  const { holders, loading } = useGetData(address, sort.value, direction.value);
  const { copyState, copyAddress } = useCopy();

  console.log("holders", holders, loading);

  return (
    <div id="leaderboard">
      <Card>
        {loading || holders === null ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="sort-box">
              <span>Sort direction:</span>
              <Select
                id="set-direction"
                onChange={d => setDirecton(d)}
                label="Set direction"
                value={direction}
                options={listDirections}
                isSearchable={false}
              />
            </div>
            <div className="sort-box">
              <span>Sort order:</span>
              <Select
                id="set-sort"
                onChange={s => setSort(s)}
                label="Set Sort"
                value={sort}
                options={listSort}
                isSearchable={false}
              />
            </div>
            <div className="clearfix" />
            <table>
              <thead>
                <tr>
                  <th width="30" />
                  <th>Address</th>
                  <th>Total gains</th>
                  <th>Num txs</th>
                  <th>Assets owned</th>
                  <th>Bluchip owned</th>
                  <th>Collection owned</th>
                  <th>Portfolio value (eth)</th>
                  <th>
                    <Tooltip
                      label={"All time"}
                      closeOnClick={false}
                      hasArrow
                      fontSize="xs"
                      bg="black"
                      color={"white"}
                      placement="top"
                      borderRadius={"7px"}
                    >
                      Collection gains
                    </Tooltip>
                  </th>
                  <th>
                    <Tooltip
                      label={"All time"}
                      closeOnClick={false}
                      hasArrow
                      fontSize="xs"
                      bg="black"
                      color={"white"}
                      placement="top"
                      borderRadius={"7px"}
                    >
                      Collection volume
                    </Tooltip>
                  </th>
                  <th>Collection assets owned</th>
                </tr>
              </thead>
              <tbody>
                {holders.map((h, i) => (
                  <tr key={JSON.stringify(h)}>
                    <td width="30">{i + 1}</td>
                    <td>
                      <Tooltip
                        label={copyState}
                        closeOnClick={false}
                        hasArrow
                        fontSize="xs"
                        bg="black"
                        color={"white"}
                        placement="top"
                        borderRadius={"7px"}
                      >
                        <p className="address" onClick={() => copyAddress(h.address)}>
                          {formatAddress(h.address)}
                        </p>
                      </Tooltip>
                    </td>
                    <td>{roundPrice2(h.total_gain)} ETH</td>
                    <td>{h.num_txs}</td>
                    <td>{h.num_assets_owned}</td>
                    <td>{h.num_blue_chips_owned}</td>
                    <td>{h.num_collections_owned}</td>
                    <td>
                      {roundPrice2(h.portfolio_value_wei / 1e18)} ETH{" "}
                      <small>({roundPriceUsd(h.portfolio_value_usd)}$)</small>
                    </td>
                    <td>{h.collection_gains_all_time}</td>
                    <td>{roundPrice2(h.collection_volume_wei_all_time / 1e18)} ETH</td>
                    <td>{h.collection_assets_owned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Card>
    </div>
  );
});

export default Leaderboard;
