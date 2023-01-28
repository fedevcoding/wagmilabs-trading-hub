import React from "react";
import { getTraderSortedValues, getVolumesSortedValues } from "./functions";
import baseUrl from "../../../../variables/baseUrl";

export const useGetData = (marketplaces, period) => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    (async () => {
      let data = await fetch(
        `${baseUrl}/volumes/overview?period=${period}&marketplaces=${marketplaces.join()}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      data = await data.json();

      const traders = getTraderSortedValues(data);
      const volumes = getVolumesSortedValues(data);

      setData({
        volumes,
        traders,
        leaderBoard: data,
      });
    })();
  }, [marketplaces, period]);

  return data;
};
