import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-sdk";
import { useGetReservoirOptions } from ".";
import { useToast } from "@chakra-ui/react";
import { checkErrors } from "../utils/functions/errorHelpers";

export const useBuyNow = (callback, quantity) => {
  const { options } = useGetReservoirOptions();

  const toast = useToast();

  async function buyNow(contract, tokenId, value) {
    try {
      const signer = await fetchSigner();
      if (typeof quantity !== "undefined") {
        options.quantity = parseInt(quantity);
      }

      await getClient()?.actions.buyToken({
        items: [
          {
            quantity: 1,
            token: `${contract}:${tokenId}`,
          },
        ],
        signer,
        options,
        expectedPrice: value,
        onProgress: steps => console.log(steps),
      });

      toast({
        title: "Success",
        description: "NFT successfully bought",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      if (callback && typeof callback === "function") {
        callback();
      }
      const error = checkErrors(e);

      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function batchBuyNow(orderIds, expectedPrice) {
    try {
      const signer = await fetchSigner();

      const items = orderIds.map(orderId => ({ quantity: 1, orderId }));

      let res = await getClient()?.actions.buyToken({
        items,
        signer,
        expectedPrice: expectedPrice,
        options,
        onProgress: steps => {
          console.log(steps);
        },
      });

      if (res.response.data.statusCode === 400) throw new Error("error");

      toast({
        title: "Success",
        description: "NFTs successfully bought",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (e) {
      const error = checkErrors(e);

      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }

  return { buyNow, batchBuyNow };
};
