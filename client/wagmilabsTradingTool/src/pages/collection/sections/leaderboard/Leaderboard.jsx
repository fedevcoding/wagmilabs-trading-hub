import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { Card, LoadingSpinner } from "@Components";
import { useGetData } from "./useGetData";
import { Filters, Row } from "./Components";
import { useFilters } from "./useFilters";
import { notFound } from "@Assets";

import "./style.scss";

const Leaderboard = React.memo(({ address }) => {
  const filters = useFilters();
  const { holders, loading } = useGetData(address, filters.sort.value, filters.direction.value);

  return (
    <div id="leaderboard">
      <Card>
        {holders === null ? (
          <LoadingSpinner />
        ) : (
          <>
            {holders.length ? (
              <>
                <Filters {...filters} />
                <table>
                  <thead>
                    <tr>
                      <th width="30" />
                      <th width="200">Address</th>
                      <th>Collection NFTs Held</th>
                      <th>NFTs Held</th>
                      <th>Bluechips Held</th>
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
                          Collection Realized P&L
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
                      <th>Total gains</th>
                      <th>Portfolio value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(loading && (
                      <tr>
                        <td colSpan={11} className="loading-row">
                          <div>
                            <div className="flex">
                              <span>Loading Data</span> <LoadingSpinner />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )) ||
                      ""}
                    {holders.map((h, i) => (
                      <Row h={h} i={i} />
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <h3 className="text-center no-holders">
                <img src={notFound} alt="holders" width={150} />
                <br />
                No holders found for this collection!
              </h3>
            )}
          </>
        )}
      </Card>
    </div>
  );
});

export default Leaderboard;
