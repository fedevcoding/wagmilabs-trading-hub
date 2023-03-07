import { useToast } from "@chakra-ui/react";

export function useRefreshToken(address, id) {
  const toast = useToast();

  const refreshToken = async () => {
    try {
      const url = `https://api.reservoir.tools/tokens/refresh/v1`;

      const options = {
        method: "POST",
        headers: { accept: "*/*", "content-type": "application/json", "x-api-key": "demo-api-key" },
        body: JSON.stringify({
          overrideCoolDown: false,
          token: `${address}:${id}`,
        }),
      };

      const { error, message } = await (await fetch(url, options)).json();

      if (error) {
        toast({
          title: `Error: ${error}`,
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Success",
          description: message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a mistake in the token refresh",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return { refreshToken };
}
