import React from "react";
import { UserDataContext } from "@Context";

export const useHasItem = listingId => {
  const { userCartItems } = React.useContext(UserDataContext);

  return userCartItems.find(
    i => i.listingId?.toLowerCase() === listingId?.toLowerCase()
  );
};
