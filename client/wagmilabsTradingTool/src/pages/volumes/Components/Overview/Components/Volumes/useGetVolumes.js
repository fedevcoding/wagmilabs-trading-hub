import React from "react";
import { getVolumesSortedValues } from "../../functions";
import { baseUrl } from "@Variables";

export const useGetVolumes = (volumes, period, currentPeriod, marketplaces) => {
  const [data, setData] = React.useState(volumes);
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

        setData(getVolumesSortedValues(data));
        setRenderDefaultPeriod(true);
        setLoding(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaces, period, currentPeriod]);

  return [data, isLoading];
};
