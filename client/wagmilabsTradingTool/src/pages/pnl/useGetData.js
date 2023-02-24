import { baseUrl } from "@Variables";
import React from "react";

export function useGetData(address, startDate, endDate) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      let data = await fetch(
        `${baseUrl}/pnl/${address}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      data = await data.json();

      setData(data);
    })();
  }, [address, startDate, endDate]);

  return {
    data,
  };
}
