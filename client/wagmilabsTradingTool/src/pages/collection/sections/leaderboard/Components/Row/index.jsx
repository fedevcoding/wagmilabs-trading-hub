import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { useCopy } from "@Hooks";
import { formatAddress, roundPrice2, roundPriceUsd } from "@Utils";

export const Row = React.memo(({ h, i }) => {
  const { copyState, copyAddress } = useCopy();

  return (
    <tr>
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
  );
});
