import React from "react";
import baseUrl from "../../variables/baseUrl";

export function useGetData(address, id) {
  const [details, setDetails] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      let apiData = await fetch(
        `${baseUrl}/collection/${address}/token/${id}/details`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      apiData = await apiData.json();

      setDetails(apiData);
      setLoading(false);
    })();
  }, [address, id]);

  return [details, isLoading];
}
