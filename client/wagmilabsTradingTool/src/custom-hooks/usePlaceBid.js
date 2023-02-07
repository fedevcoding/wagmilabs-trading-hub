import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useGetReservoirOptions } from ".";
import { marketListingMapping } from "../utils/mappings";
import { useToast } from "@chakra-ui/react";

export const usePlaceBid = marketplace => {
  const { options } = useGetReservoirOptions();
  const { orderbook, orderKind } =
    marketListingMapping[marketplace.toLowerCase()] || {};
  const toast = useToast();

  async function placeBid(tokenAddress, price) {
    const signer = await fetchSigner();

    const weiPrice = (price * 10 ** 18).toString();

    getClient()?.actions.placeBid({
      bids: [
        {
          weiPrice,
          orderbook,
          orderKind,
          token: tokenAddress,
        },
      ],
      signer,
      options,
      onProgress: steps => {
        console.log(steps);
      },
    });

    setTimeout(function () {
      // insert this condition only if place bid successfully
      toast({
        title: "Success",
        description: "Bid successfully placed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 500);
  }

  return { placeBid };
};
