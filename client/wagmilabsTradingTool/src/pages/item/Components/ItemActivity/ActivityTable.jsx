import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { formatContractAddress } from "@Utils/formats/formats";
import { getEvent } from "./functions";

import moment from "moment";
import getMarketplaceImage from "src/utils/marketplaceImageMapping";

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
            <td>
              {getEvent(a.type)}
              {(a?.order?.source?.name && (
                <img
                  alt={a.order.source.name}
                  src={getMarketplaceImage(a.order.source.name.toLowerCase())}
                  width={20}
                  className="market-img"
                />
              )) ||
                ""}
            </td>
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
            <td className="td-date">
              {moment(a.createdAt).fromNow()}
              {(a?.txHash && (
                <a
                  title="Etherscan transaction"
                  href={`https://etherscan.io/tx/${a.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-sharp fa-solid fa-up-right-from-square" />
                </a>
              )) ||
                ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
