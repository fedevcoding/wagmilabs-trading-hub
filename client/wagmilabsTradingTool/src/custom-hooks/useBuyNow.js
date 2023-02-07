import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useGetReservoirOptions } from ".";
import { useToast } from "@chakra-ui/react";

export const useBuyNow = callback => {
  const { options } = useGetReservoirOptions();

  const toast = useToast();

  async function buyNow(contract, tokenId, value) {
    const signer = await fetchSigner();

    getClient()?.actions.buyToken({
      tokens: [{ tokenId, contract: contract }],
      signer,
      options,
      expectedPrice: value,
      onProgress: steps => {
        console.log(steps);
      },
    }).catch((e) => {
      if (callback && typeof callback === "function") {
        callback();
      }
      toast({
        title: "Error",
        description:
          "Something went wrong, try checking order availability or wallet funds",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    })
  }

  return { buyNow };
};
