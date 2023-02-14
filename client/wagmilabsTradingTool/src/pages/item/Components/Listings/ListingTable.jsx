import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { formatContractAddress } from "@Utils/formats/formats";
import { useAddItemToCart } from "@Hooks";

import moment from "moment";
import { useGetVariables } from "../PriceBox/useGetVariables";

export const ListingTable = React.memo(({ listings, address, details }) => {
  const { name, tokenId, image, marketplace, collectionName } =
    useGetVariables(details);
  const { addItemToCart } = useAddItemToCart(address);
  const hasAmount = details.token.kind === "erc1155";

  return (
    <table>
      <thead>
        <tr>
          <th>Unit Price</th>
          <th>USD Unit Price</th>
          {hasAmount ? <th>Quantity</th> : <></>}
          <th>From</th>
          <th>Expiration</th>
          <th className="add-cart" />
        </tr>
      </thead>
      <tbody>
        {(listings || []).map(a => (
          <tr
            key={Object.values(a)
              .filter(v => typeof v === "string")
              .join()}
          >
            <td>
              {(a.price && (
                <>
                  {a.price.amount.native} {a.price.currency.symbol}
                </>
              )) ||
                ""}
            </td>
            <td>{(a.price && <>{a.price.amount.usd?.toFixed(2)}$</>) || ""}</td>
            {hasAmount ? <td>{a.quantityRemaining}</td> : <></>}
            <td>
              <Tooltip
                closeOnClick={false}
                hasArrow
                label={a.maker}
                fontSize="xs"
                bg="black"
                color={"white"}
                placement="top"
                borderRadius={"7px"}
              >
                {formatContractAddress(a.maker)}
              </Tooltip>
            </td>
            <td>{moment(a.expiration * 1000).fromNow()}</td>
            <td
              className="add-cart"
              onClick={() =>
                addItemToCart(
                  name,
                  tokenId,
                  a.price.amount.native,
                  image,
                  marketplace,
                  collectionName
                )
              }
            >
              <i className="fa fa-cart-shopping" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
