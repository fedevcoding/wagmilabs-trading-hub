import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { LoadingSpinner } from "../../../utility-components";
import { formatContractAddress } from "../../../../utils/formats/formats";
import { getEvent } from "./functions";

import "./style.css";
import { useGetData } from "./useGetData";
import moment from "moment";

export const ItemActivity = React.memo(({ address, id, currency }) => {
  const [activities, isLoading] = useGetData(address, id);

  console.log(activities);

  return (
    <div id="item-activity">
      {(activities && !isLoading && (
        <>
          <h2>Item Activity</h2>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Price</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(activities?.activities || []).map(a => (
                <tr
                  key={Object.values(a)
                    .filter(v => typeof v === "string")
                    .join()}
                >
                  <td>{getEvent(a.type)}</td>
                  <td>
                    {(a.price && (
                      <>
                        {a.price} {currency}
                      </>
                    )) ||
                      ""}
                  </td>
                  <td>
                    <Tooltip
                      closeOnClick={false}
                      hasArrow
                      label={a.fromAddress}
                      fontSize="xs"
                      bg="black"
                      color={"white"}
                      placement="top"
                      borderRadius={"7px"}
                    >
                      {formatContractAddress(a.fromAddress)}
                    </Tooltip>
                  </td>
                  <td>
                    {(a.toAddress && (
                      <Tooltip
                        closeOnClick={false}
                        hasArrow
                        label={a.toAddress}
                        fontSize="xs"
                        bg="black"
                        color={"white"}
                        placement="top"
                        borderRadius={"7px"}
                      >
                        {formatContractAddress(a.toAddress)}
                      </Tooltip>
                    )) ||
                      ""}
                  </td>
                  <td>{moment(a.createdAt).fromNow()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )) || <LoadingSpinner />}
    </div>
  );
});
