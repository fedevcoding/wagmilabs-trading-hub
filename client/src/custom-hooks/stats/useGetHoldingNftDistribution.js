import React from "react";
import { baseUrl } from "@Variables";

export function useGetHoldingNftDistribution(address, limit = "200") {
  const [loading, setLoading] = React.useState(false);
  const [tokenCount, setTokenCount] = React.useState(0);
  const [distribution, setDistribution] = React.useState([]);
  const [continuation, setContinuation] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let url = `${baseUrl}/holdingNftDistribution?limit=${limit}&userAddress=${address}`;

      try {
        setLoading(true);
        let data = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
          },
        });

        data = await data.json();

        const { collections: distribution, tokenCount: count, continuation: next } = data;

        setTokenCount(count);
        setContinuation(next);
        setDistribution(distribution);
        setLoading(false);
      } catch (e) {
        setDistribution([]);
        setLoading(false);
      }
    })();
  }, [limit, address]);

  return {
    loading,
    distribution,
    continuation,
    tokenCount,
    setDistribution,
    setLoading,
  };
}
