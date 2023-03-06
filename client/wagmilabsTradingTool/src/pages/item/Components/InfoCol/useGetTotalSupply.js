import React from "react";
import { baseUrl } from "@Variables";

export function useGetTotalSupply(address, id) {
  const [totalSupply, setTotalSupply] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      if (address) {
        let data = await fetch(`${baseUrl}/collection/${address}/token/${id}/total-supply`, {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        });
        data = await data.json();

        if (data?.totalSupply) {
          setTotalSupply(data?.totalSupply);
        }
      }
    })();
  }, [address, id]);

  return totalSupply;
}
