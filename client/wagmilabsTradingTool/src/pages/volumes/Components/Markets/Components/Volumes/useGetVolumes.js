import React from "react";
import baseUrl from "../../../../../../variables/baseUrl";

export const useGetVolumes = (volumes, period, currentPeriod, marketplace) => {
  const [data, setData] = React.useState(volumes);
  const [isLoading, setLoding] = React.useState(false);
  const [renderDefaultPeriod, setRenderDefaultPeriod] = React.useState(false);

  React.useEffect(() => {
    if (period !== currentPeriod || renderDefaultPeriod) {
      (async () => {
        setLoding(true);
        let apiData = await fetch(
          `${baseUrl}/volumes/${marketplace.toLowerCase()}?period=${currentPeriod.toLowerCase()}&filter=volumes`,
          {
            headers: {
              "x-auth-token": localStorage.jsonwebtoken,
            },
          }
        );

        apiData = await apiData.json();

        setData(apiData);

        setRenderDefaultPeriod(true);
        setLoding(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, currentPeriod]);

  React.useEffect(() => {
    setData(volumes);
  }, [volumes]);

  return [data, isLoading];
};
