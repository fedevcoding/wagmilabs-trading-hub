import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useToast } from "@chakra-ui/react";

export const useAcceptOffer = () => {
  const toast = useToast();

  async function acceptOffer(contract, tokenId) {
    try {
      const signer = await fetchSigner();

      await getClient()?.actions.acceptOffer({
        token: {
          tokenId,
          contract,
        },
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
