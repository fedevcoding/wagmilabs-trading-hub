import React from "react";
import { baseUrl } from "@Variables";

export function useGetData(address, startDate, endDate) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (endDate) {
      (async () => {
        let data = await fetch(`${baseUrl}/p-and-l/${address}?startDate=${startDate}&endDate=${endDate}`, {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        });

        setData((await data.json()).reverse());
      })();
    }
  }, [address, startDate, endDate]);

  return {
    data,
  };
}
