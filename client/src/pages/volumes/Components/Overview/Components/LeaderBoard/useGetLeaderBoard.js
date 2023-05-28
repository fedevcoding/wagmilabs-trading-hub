import React from "react";
import { baseUrl } from "@Variables";

export const useGetLeaderBoard = (
  leaderBoard,
  period,
  currentPeriod,
  marketplaces
) => {
  const [data, setData] = React.useState(leaderBoard);
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

        setData(data);
        setRenderDefaultPeriod(true);
        setLoding(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaces, period, currentPeriod]);

  return [data, isLoading];
};
