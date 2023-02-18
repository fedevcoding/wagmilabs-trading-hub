import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { formatContractAddress } from "@Utils";
import { getEvent } from "./functions";

import moment from "moment";

export const ActivityTable = React.memo(({ activities, currency }) => {
  const hasAmount = (activities?.activities || []).length
    ? !!activities?.activities[0].amount
    : false;

  return (
    <table>
      <thead>
        <tr>
          <th>Event</th>
          {hasAmount ? <th>Amount</th> : <></>}
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
            {hasAmount ? <td>{a.amount}</td> : <></>}
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
  );
});
