import React from "react";

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
          `${nftGoPath}?limit=100&offset=0&range=${currentPeriod.toLowerCase()}&fields=volume,volumeEth&by=volumeEth&asc=-1&excludeWashTrading=-1`
        );

        nftgoData = (await nftgoData.json()).data.list.filter(v =>
          marketplaces.includes(v.name)
        );

        const labels = nftgoData.map(m => m.name);

        setData({
          labels,
          values: nftgoData.map((m, i) => ({
            x: i + 1,
            y: +m.volumeEth.toFixed(2),
            secondValue: parseInt(m.volume).toLocaleString("EN-us"),
          })),
        });
        setRenderDefaultPeriod(true);
        setLoding(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaces, period, currentPeriod]);

  return [data, isLoading];
};
