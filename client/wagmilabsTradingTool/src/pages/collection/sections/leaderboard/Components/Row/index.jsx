import React from "react";
import { HStack, Tooltip } from "@chakra-ui/react";
import { useCopy } from "@Hooks";
import { formatAddress, roundPrice2, roundPriceUsd } from "@Utils";
import { Number } from "@Components";

export const Row = React.memo(({ h, i }) => {
  const { copyState, copyAddress } = useCopy();

  return (
    <tr>
      <td>{i + 1}</td>
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
        <HStack justifyContent={"center"}>
          <i className="fa-brands fa-ethereum" />
          <Number n={h.total_gain} crypto={true} />
        </HStack>
      </td>
      <td>{h.num_txs}</td>
      <td>{h.num_blue_chips_owned}</td>
      <td>
        <i className="fa-brands fa-ethereum" /> {roundPrice2(h.portfolio_value_wei / 1e18)}
        <br />
        <small>({roundPriceUsd(h.portfolio_value_usd)}$)</small>
      </td>
      <td>
        <HStack justifyContent={"center"}>
          <i className="fa-brands fa-ethereum" />
          <Number n={h.collection_gains_all_time} crypto={true} />
        </HStack>
      </td>
      <td>
        <i className="fa-brands fa-ethereum" /> {roundPrice2(h.collection_volume_wei_all_time / 1e18)}
      </td>
      <td>{h.collection_assets_owned}</td>
    </tr>
  );
});
