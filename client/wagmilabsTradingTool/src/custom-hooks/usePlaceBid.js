import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useGetReservoirOptions } from ".";
import { marketListingMapping } from "@Utils/mappings";
import { useToast } from "@chakra-ui/react";

export const usePlaceBid = marketplace => {
  const { options } = useGetReservoirOptions();
  const { orderbook, orderKind } = marketListingMapping[marketplace.toLowerCase()] || {};
  const toast = useToast();

  async function placeBid(tokenAddress, price, date) {
    if (price <= 0) {
      toast({
        title: "Error Place Bid NFT.",
        description: "Please, insert a valid price",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return 0;
    }

    if (!date) {
      toast({
        title: "Error Place Bid NFT.",
        description: "Please, insert a valid expiration date",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return 0;
    }

    const signer = await fetchSigner();
    const weiPrice = (price * 10 ** 18).toString();

    try {
      await getClient()?.actions.placeBid({
        bids: [
          {
            weiPrice,
            orderbook,
            orderKind,
            token: tokenAddress,
            expirationTime: parseInt(new Date(date).getTime() / 1000).toString(),
          },
        ],
        signer,
        options,
        onProgress: steps => {
          console.log(steps);
        },
      });

      toast({
        title: "Success",
        description: "Bid successfully placed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      const error = e?.response?.data?.message || "Something went wrong";

      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return { placeBid };
};
