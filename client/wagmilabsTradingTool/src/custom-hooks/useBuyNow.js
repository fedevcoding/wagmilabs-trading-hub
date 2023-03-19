import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useGetReservoirOptions } from ".";
import { useToast } from "@chakra-ui/react";

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
        tokens: [{ tokenId, contract: contract }],
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
      console.log(e);
      if (callback && typeof callback === "function") {
        callback();
      }
      const error =
        e?.response?.data?.message ||
        (String(e).includes("rejected")
          ? "Transaction rejected"
          : "Something went wrong, try checking order availability or wallet funds");

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

      let res = await getClient()?.actions.buyToken({
        orderIds,
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
      const error =
        e?.response?.data?.message ||
        (String(e).includes("rejected")
          ? "Transaction rejected"
          : "Something went wrong, try checking order availability or wallet funds");

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
