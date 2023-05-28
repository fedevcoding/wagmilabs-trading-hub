import React from "react";
import { baseUrl } from "@Variables";

export function useGetData(address) {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      let data = await fetch(`${baseUrl}/stats/${address}`, {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });

      setData(await data.json());
      setIsLoading(false);
    })();
  }, [address]);

  return {
    data,
    isLoading,
  };
}
