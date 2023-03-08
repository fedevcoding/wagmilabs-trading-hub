import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { Card, LoadingSpinner } from "@Components";
import { formatAddress } from "@Utils";
import { useGetData } from "./useGetData";
import copy from "copy-to-clipboard";

import "./style.scss";

const Leaderboard = ({ address }) => {
  console.log("address", address);
  const { holders, loading } = useGetData(address);
  const [copyState, setCopyState] = React.useState("Copy");

  const copyAddress = address => {
    copy(address);
    setCopyState("Copied");
    setTimeout(() => {
      setCopyState("Copy");
    }, 400);
  };

  console.log("holders", holders, loading);

  return (
    <div id="leaderboard">
      <Card>
        {loading || holders === null ? (
          <LoadingSpinner />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {holders.map(h => (
                <tr key={JSON.stringify(h)}>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;
