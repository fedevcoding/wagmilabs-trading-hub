import React from "react";
import { getTraderSortedValues } from "../../functions";
import baseUrl from "../../../../../../variables/baseUrl";

export const useGetTraders = (traders, period, currentPeriod, marketplaces) => {
  const [data, setData] = React.useState(traders);
  const [isLoading, setLoding] = React.useState(false);
  const [renderDefaultPeriod, setRenderDefaultPeriod] = React.useState(false);

  React.useEffect(() => {
    if (period !== currentPeriod || renderDefaultPeriod) {
      (async () => {
        setLoding(true);
        let data = await fetch(
          `${baseUrl}/volumes/overview?period=${currentPeriod}&marketplaces=${marketplaces.join()}`,
          {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          }
        );

        data = await data.json();

        setData(getTraderSortedValues(data));
        setRenderDefaultPeriod(true);
        setLoding(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaces, period, currentPeriod]);

  return [data, isLoading];
};
