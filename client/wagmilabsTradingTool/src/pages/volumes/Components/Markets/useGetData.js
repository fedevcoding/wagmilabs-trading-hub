import React from "react";
import baseUrl from "../../../../variables/baseUrl";

export const useGetData = (marketplace, period) => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    (async () => {
      let apiData = await fetch(
        `${baseUrl}/volumes/${marketplace.toLowerCase()}?period=${period.toLowerCase()}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      apiData = await apiData.json();

      setData(apiData);
    })();
  }, [marketplace, period]);

  return data;
};
