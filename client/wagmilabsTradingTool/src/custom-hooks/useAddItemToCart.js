import React from "react";
import { NotificationManager } from "react-notifications";
import { UserDataContext } from "../context/userContext";
import addToCart from "../utils/database-functions/addToCart";

export const useAddItemToCart = address => {
  const { setUserCartItems } = React.useContext(UserDataContext);

  async function addItemToCart(
    name,
    tokenId,
    price,
    image,
    marketplace,
    collectionName
  ) {
    let pushStatus = await addToCart({
      name,
      collectionName,
      tokenId,
      price,
      image,
      marketplace,
      contractAddress: address,
    });

    if (pushStatus === "success") {
      setUserCartItems(prevItems => [
        ...prevItems,
        {
          name,
          tokenId,
          price,
          image,
          marketplace,
          collectionName,
          contractAddress: address,
        },
      ]);
      NotificationManager.success("Item successfully added");
    }
  }

  return { addItemToCart };
};
