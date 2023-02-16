import React from "react";
import { UserDataContext } from "@Context";

export const useHasItem = (address, tokenId) => {
  const { userCartItems } = React.useContext(UserDataContext);

  return userCartItems.find(
    i =>
      i.contractAddress === address &&
      i.tokenId.toString() === tokenId.toString()
  );
};
