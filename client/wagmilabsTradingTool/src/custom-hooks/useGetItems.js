import React from "react";
import { baseUrl } from "@Variables";

export function useGetItems(limit = "50", sortDirection = null, collection = null, pageAddress, nftsContinuation) {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [continuation, setContinuation] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let url = `${baseUrl}/profileItems?limit=${limit}&address=${pageAddress}`;
      url += sortDirection ? `&sortDirection=${sortDirection}` : "";
      url += collection ? `&collection=${collection}` : "";
      url += nftsContinuation.current ? `&continuation=${nftsContinuation.current}` : "";

      try {
        setLoading(true);
        let data = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
          },
        });

        data = await data.json();

        const { tokens, continuation: next } = data;
        nftsContinuation.current = next;
        setContinuation(next);
        setItems(tokens);
        setLoading(false);
      } catch (e) {
        setItems([]);
        setLoading(false);
      }
    })();
  }, [sortDirection, collection, limit, pageAddress, nftsContinuation]);

  return {
    loading,
    items,
    continuation,
    setItems,
    setLoading,
  };
}
