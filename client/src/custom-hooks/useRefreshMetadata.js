import { getFromServer } from "@Utils";
import { useToast } from "@chakra-ui/react";

export const useRefreshMetadata = callback => {

    const toast = useToast()

  async function refreshMetadata(address) {
    try {
        callback(true)

      await getFromServer(`/refreshCollection/${address}`)

      callback(false)

      toast({
        title: "Success",
        description: "Metadata refreshed correctly",
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

  return { refreshMetadata };
};
