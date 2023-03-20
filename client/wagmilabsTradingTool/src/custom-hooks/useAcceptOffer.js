import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-sdk";
import { useToast } from "@chakra-ui/react";

export const useAcceptOffer = () => {
  const toast = useToast();

  async function acceptOffer(contract, tokenId) {
    try {
      const signer = await fetchSigner();

      await getClient()?.actions.acceptOffer({
        items: [
          {
            quantity: 1,
            token: `${contract}:${tokenId}`,
          },
        ],
        signer,
        onProgress: steps => {
          console.log(steps);
        },
      });

      toast({
        title: "Success",
        description: "Offer successfully accepted",
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

  return { acceptOffer };
};
