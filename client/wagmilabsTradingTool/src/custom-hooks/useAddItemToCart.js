import React from "react";
import { useToast } from "@chakra-ui/react";
import { UserDataContext } from "@Context/userContext";
import addToCart from "@Utils/database-functions/addToCart";

export const useAddItemToCart = (address, callback) => {
  const { setUserCartItems, userCartItems } = React.useContext(UserDataContext);
  const toast = useToast();
  let addItemToCart = null;

  try {
    addItemToCart = async (
      name,
      tokenId,
      price,
      image,
      marketplace,
      collectionName,
      index
    ) => {
      if (
        userCartItems.find(
          i =>
            i.contractAddress === address &&
            i.tokenId.toString() === tokenId.toString()
        )
      ) {
        toast({
          title: "Error",
          description: "This NFT it's already in the cart!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return 0;
      }

      let { pushStatus, filteredItems } = await addToCart({
        name,
        collectionName,
        tokenId,
        price,
        image,
        marketplace,
        contractAddress: address,
      });

      if (pushStatus === "success") {
        setUserCartItems(filteredItems);
        if (callback && typeof callback === "function") {
          callback(index, image);
        } else {
          toast({
            title: "Success",
            description: "Item successfully added",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
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

  return { addItemToCart };
};
