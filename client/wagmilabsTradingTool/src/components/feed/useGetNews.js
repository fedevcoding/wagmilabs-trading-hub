import React from "react";
import baseUrl from "../../variables/baseUrl";

export function useGetNews() {
  const [news, setNews] = React.useState({});

  React.useEffect(() => {
    (async () => {
      setNews(
        await (
          await fetch(`${baseUrl}/feed/list`, {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          })
        ).json()
      );
    })();
  }, []);

  return news;
}
