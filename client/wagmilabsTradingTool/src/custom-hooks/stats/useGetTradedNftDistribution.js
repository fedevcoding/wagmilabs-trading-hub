import React from "react";
import { baseUrl } from "@Variables";

export function useGetTradedNftDistribution(address, days = "30") {
  const [loading, setLoading] = React.useState(false);
  const [nfts, setNfts] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let url = `${baseUrl}/tradedDistribution?days=${days}&userAddress=${address}`;

      try {
        setLoading(true);
        let data = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
          },
        });

        data = await data.json();

        const { nfts: nftList } = data;

        setNfts(nftList);
        setLoading(false);
      } catch (e) {
        setNfts([]);
        setLoading(false);
      }
    })();
  }, [days, address]);

  return {
    loading,
    nfts,
  };
}
