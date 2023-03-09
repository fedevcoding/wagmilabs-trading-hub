import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { Card, LoadingSpinner } from "@Components";
import { formatAddress, roundPrice2, roundPriceUsd } from "@Utils";
import { useGetData } from "./useGetData";
import { useCopy } from "@Hooks";
import { Filters } from "./Components";
import { useFilters } from "./useFilters";

import "./style.scss";

const Leaderboard = React.memo(({ address }) => {
  const filters = useFilters();
  const { holders, loading } = useGetData(address, filters.sort.value, filters.direction.value);
  const { copyState, copyAddress } = useCopy();

  console.log("holders", holders, filters);

  return (
    <div id="leaderboard">
      <Card>
        {loading || holders === null ? (
          <LoadingSpinner />
        ) : (
          <>
            <Filters {...filters} />
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
                  <th>Portfolio value</th>
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
                    <td>
                      <i className="fa-brands fa-ethereum" /> {roundPrice2(h.total_gain)}
                    </td>
                    <td>{h.num_txs}</td>
                    <td>{h.num_assets_owned}</td>
                    <td>{h.num_blue_chips_owned}</td>
                    <td>{h.num_collections_owned}</td>
                    <td>
                      <i className="fa-brands fa-ethereum" /> {roundPrice2(h.portfolio_value_wei / 1e18)}
                      <small>({roundPriceUsd(h.portfolio_value_usd)}$)</small>
                    </td>
                    <td>{h.collection_gains_all_time}</td>
                    <td>
                      <i className="fa-brands fa-ethereum" /> {roundPrice2(h.collection_volume_wei_all_time / 1e18)}
                    </td>
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
