import React from "react";

export const useGetLeaderBoard = (
  leaderBoard,
  period,
  currentPeriod,
  marketplaces
) => {
  const [data, setData] = React.useState(leaderBoard);
  const [renderDefaultPeriod, setRenderDefaultPeriod] = React.useState(false);

  React.useEffect(() => {
    if (period !== currentPeriod || renderDefaultPeriod) {
      (async () => {
        const nftGoPath =
          "https://api.nftgo.io/api/v1/ranking/marketplace-list";

        let nftgoData = await fetch(
          `${nftGoPath}?limit=100&offset=0&range=${currentPeriod.toLowerCase()}&fields=volumeEth,traderNum,saleNum&by=volumeEth&asc=-1&excludeWashTrading=-1`
        );

        nftgoData = (await nftgoData.json()).data.list.filter(v =>
          marketplaces.includes(v.name)
        );

        setData(nftgoData);
        setRenderDefaultPeriod(true);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaces, period, currentPeriod]);

  return data;
};
