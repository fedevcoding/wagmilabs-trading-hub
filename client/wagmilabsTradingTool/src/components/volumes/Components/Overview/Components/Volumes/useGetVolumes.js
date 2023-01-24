import React from "react";
import { getVolumesSortedValues } from "../../functions";

export const useGetVolumes = (volumes, period, currentPeriod, marketplaces) => {
  const [data, setData] = React.useState(volumes);
  const [isLoading, setLoding] = React.useState(false);
  const [renderDefaultPeriod, setRenderDefaultPeriod] = React.useState(false);

  React.useEffect(() => {
    if (period !== currentPeriod || renderDefaultPeriod) {
      (async () => {
        setLoding(true);
        const nftGoPath =
          "https://api.nftgo.io/api/v1/ranking/marketplace-list";

        let nftgoData = await fetch(
          `${nftGoPath}?limit=100&offset=0&range=${currentPeriod}&fields=volume,volumeEth&by=volumeEth&asc=-1&excludeWashTrading=-1`
        );

        nftgoData = (await nftgoData.json()).data.list.filter(v =>
          marketplaces.includes(v.name)
        );

        setData(getVolumesSortedValues(nftgoData));
        setRenderDefaultPeriod(true);
        setLoding(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaces, period, currentPeriod]);

  return [data, isLoading];
};
