import { Tooltip } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { useAccount } from "wagmi";
import { formatContractAddress } from "../../../../utils/formats/formats";

import "./style.css";

export const BestOfferTable = React.memo(({ details }) => {
  const { address: accountAddress } = useAccount();
  const isOwner = details ? accountAddress === details?.token?.owner : false;
  const topBid = details?.market?.topBid;

  return (
    <>
      {(!isOwner && topBid.id && (
        <div className="best-offer">
          <p>Best offer</p>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>USD Price</th>
                <th>Expiration</th>
                <th>From</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {topBid.price.amount.decimal} {topBid.price.currency.symbol}
                </td>
                <td>
                  $
                  {topBid.price.amount.usd.toLocaleString("EN-us", {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  {moment(topBid.validUntil * 1000).format(
                    "MMM DD, YYYY HH:mm"
                  )}
                </td>
                <td>
                  <Tooltip
                    closeOnClick={false}
                    hasArrow
                    label={topBid.maker}
                    fontSize="xs"
                    bg="black"
                    color={"white"}
                    placement="top"
                    borderRadius={"7px"}
                  >
                    {formatContractAddress(topBid.maker)}
                  </Tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )) || (
        <div className="best-offer">There are no offers for this asset</div>
      )}
    </>
  );
});
