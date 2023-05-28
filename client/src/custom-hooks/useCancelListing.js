import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-sdk";
import { useToast } from "@chakra-ui/react";
import { checkErrors } from "../utils/functions/errorHelpers";

export const useCancelListing = id => {
  const toast = useToast();

  async function cancelListing() {
    try {
      const signer = await fetchSigner();

      await getClient()?.actions.cancelOrder({
        id,
        signer,
        onProgress: steps => {
          console.log(steps);
        },
      });

      toast({
        title: "Success",
        description: "Listing successfully canceled",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
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

  return { cancelListing };
};
