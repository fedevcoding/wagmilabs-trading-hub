import { useToast } from "@chakra-ui/react";
import { getClient } from "@reservoir0x/reservoir-sdk";
import { fetchSigner } from "@wagmi/core";
import { checkErrors } from "../utils/functions/errorHelpers";

export const useBulkList = callback => {
  const toast = useToast();

  async function bulkListNfts(listings) {
    try {
      const signer = await fetchSigner();

      await getClient()?.actions.listToken({
        listings,
        signer,
        onProgress: steps => {
          if (steps[0].items.every(item => item.status === "complete")) {
            const totalAmount = steps[1].items.length;
            const completedAmount = steps[1].items.filter(item => item.status === "complete").length;
            callback({ totalAmount, completedAmount, type: "sign" });
          } else {
            const totalAmount = steps[0].items.length;
            const completedAmount = steps[0].items.filter(item => item.status === "complete").length;
            callback({ totalAmount, completedAmount, type: "approve" });
          }
        },
      });

      toast({
        title: "NFTs listed.",
        description: "Your NFTs has been succesfully listed!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      return true;
    } catch (e) {
      const error = checkErrors(e);

      toast({
        title: "Error listing NFT.",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }

  return { bulkListNfts };
};
