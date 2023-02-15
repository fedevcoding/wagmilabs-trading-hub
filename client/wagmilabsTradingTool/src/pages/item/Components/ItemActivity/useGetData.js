import React from "react";
import { baseUrl } from "@Variables";

export function useGetData(address, id, type) {
  const [activities, setActivities] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      let apiData = await fetch(
        `${baseUrl}/collection/${address}/token/${id}/activities${
          type ? `?types=${type}` : ""
        }`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      apiData = await apiData.json();

      setActivities(apiData);
      setLoading(false);
    })();
  }, [address, id, type]);

  return [activities, isLoading];
}
