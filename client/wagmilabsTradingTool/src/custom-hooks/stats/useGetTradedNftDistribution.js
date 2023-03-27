import React from "react";
import { baseUrl } from "@Variables";

export function useGetTradedNftDistribution(days = "30") {
  const [loading, setLoading] = React.useState(false);
  const [nfts, setNfts] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let url = `${baseUrl}/tradedDistribution?days=${days}`;

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
  }, [days]);

  return {
    loading,
    nfts,
  };
}
