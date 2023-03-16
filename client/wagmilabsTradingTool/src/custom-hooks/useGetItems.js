import React from "react";
import { baseUrl } from "@Variables";

export function useGetItems(limit = "50", sortDirection = null, collection = null) {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [continuation, setContinuation] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let url = `${baseUrl}/profileItems?limit=${limit}`;
      url += sortDirection ? `&sortDirection=${sortDirection}` : "";
      url += collection ? `&collection=${collection}` : "";

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

        setContinuation(next);
        setItems(tokens);
        setLoading(false);
      } catch (e) {
        setItems([]);
        setLoading(false);
      }
    })();
  }, [sortDirection, collection, limit]);

  return {
    loading,
    items,
    continuation,
    setItems,
    setLoading,
  };
}
