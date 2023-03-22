import { useToast } from "@chakra-ui/react";
import { checkErrors } from "../utils/functions/errorHelpers";

export const useBulkList = () => {
  const toast = useToast();

  async function bulkListnfts(tokens) {
    try {
    } catch (e) {
      const error = checkErrors(e);

      toast({
        title: "Error listing NFT.",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return { bulkListnfts };
};
