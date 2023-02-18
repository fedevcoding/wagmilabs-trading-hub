import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { formatContractAddress } from "@Utils/formats/formats";
import {
  useAddItemToCart,
  useCancelListing,
  useRemoveItemFromCart,
} from "@Hooks";
import { useGetVariables } from "../PriceBox/useGetVariables";
import moment from "moment";
import { useAccount } from "wagmi";
import { UserDataContext } from "@Context";

export const TableRow = React.memo(({ listing, address, details }) => {
  const { name, tokenId, image, marketplace, collectionName } =
    useGetVariables(details);
  const { addItemToCart } = useAddItemToCart(address);
  const { removeItemFromCart } = useRemoveItemFromCart();
  const { cancelListing } = useCancelListing(listing.id);
  const hasAmount = details.token.kind === "erc1155";
  const { address: myAddress } = useAccount();
  const isMyListing = listing.maker.toLowerCase() === myAddress.toLowerCase();
  const { userCartItems } = React.useContext(UserDataContext);
  const listingIdIntoCart = userCartItems.map(i => i.listingId.toLowerCase());
  const inCart = listingIdIntoCart.includes(listing.id);

  return (
    <tr>
      <td>
        {(listing.price && (
          <>
            {listing.price.amount.native} {listing.price.currency.symbol}
          </>
        )) ||
          ""}
      </td>
      <td>
        {(listing.price && <>{listing.price.amount.usd?.toFixed(2)}$</>) || ""}
      </td>
      {hasAmount ? <td>{listing.quantityRemaining}</td> : <></>}
      <td>
        <Tooltip
          closeOnClick={false}
          hasArrow
          label={listing.maker}
          fontSize="xs"
          bg="black"
          color={"white"}
          placement="top"
          borderRadius={"7px"}
        >
          {formatContractAddress(listing.maker)}
        </Tooltip>
      </td>
      <td>{moment(listing.expiration * 1000).fromNow()}</td>
      <td
        className="row-action"
        onClick={() =>
          isMyListing
            ? cancelListing()
            : inCart
            ? removeItemFromCart(tokenId, address)
            : addItemToCart(
                name,
                tokenId,
                listing.price.amount.native,
                image,
                marketplace,
                collectionName,
                undefined,
                listing.id
              )
        }
      >
        <Tooltip
          closeOnClick={false}
          hasArrow
          label={
            isMyListing
              ? "Remove listing"
              : inCart
              ? "Remove from cart"
              : "Add to cart"
          }
          fontSize="xs"
          bg="black"
          color="white"
          placement="top"
          borderRadius="7px"
        >
          {isMyListing ? (
            <div className="btn btn-cancel">Cancel</div>
          ) : (
            <div>
              {inCart ? (
                <i className="fa fa-cart-minus" />
              ) : (
                <i className="fa fa-cart-plus" />
              )}
            </div>
          )}
        </Tooltip>
      </td>
    </tr>
  );
});
