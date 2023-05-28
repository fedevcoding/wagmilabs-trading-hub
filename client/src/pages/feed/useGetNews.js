import React from "react";
import { baseUrl } from "@Variables";

export function useGetNews(page) {
  const [news, setNews] = React.useState({});
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setNews(
        await (
          await fetch(`${baseUrl}/feed/list?page=${page}`, {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          })
        ).json()
      );
      setLoading(false);
    })();
  }, [page]);

  return { news, isLoading };
}
