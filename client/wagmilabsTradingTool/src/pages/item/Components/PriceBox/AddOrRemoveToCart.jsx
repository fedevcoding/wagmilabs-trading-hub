import React from "react";
import { useGetItemFunctions, useHasItem, useRemoveItemFromCart } from "@Hooks";
import { useGetVariables } from "./useGetVariables";

export const AddOrRemoveToCart = React.memo(({ details, address }) => {
  const { addItemToCart } = useGetItemFunctions(address);
  const { removeItemFromCart } = useRemoveItemFromCart();
  const { name, tokenId, value, image, marketplace, collectionName } =
    useGetVariables(details);
  const hasItem = useHasItem(address, tokenId);

  return hasItem ? (
    <div className="btn" onClick={() => removeItemFromCart(tokenId, address)}>
      <i className="fa fa-minus" />
      Remove from cart
    </div>
  ) : (
    <div
      className="btn"
      onClick={() =>
        addItemToCart(name, tokenId, value, image, marketplace, collectionName)
      }
    >
      <i className="fa fa-cart-shopping" />
      Add to cart
    </div>
  );
});
