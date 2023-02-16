import React from "react";
import { useToast } from "@chakra-ui/react";
import { UserDataContext } from "@Context";
import removeFromCart from "@Utils/database-functions/removeFromCart";

export const useRemoveItemFromCart = address => {
  const { setUserCartItems } = React.useContext(UserDataContext);
  const toast = useToast();
  let removeItemFromCart = null;

  try {
    removeItemFromCart = async (tokenId, contractAddress) => {
      const { pushStatus, filteredItems } = await removeFromCart(
        tokenId,
        contractAddress
      );
      if (pushStatus === "success") {
        setUserCartItems(filteredItems);
        toast({
          title: "Success",
          description: "Item successfully removed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("error");
      }
    };
  } catch (e) {
    toast({
      title: "Error",
      description: "Something went wrong",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }

  return { removeItemFromCart };
};
