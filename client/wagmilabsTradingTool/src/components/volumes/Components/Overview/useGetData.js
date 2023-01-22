import React from "react";

export const useGetData = (marketplaces, period) => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    (async () => {
      /* const data = await fetch(
        `${baseUrl}/volumes?period=${period}&marketplaces=${marketplaces.join()}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );*/

      const nftGoPath = "https://api.nftgo.io/api/v1/ranking/marketplace-list";

      let nftgoData = await fetch(
        `${nftGoPath}?limit=100&offset=0&range=${period.toLowerCase()}&fields=volumeEth,traderNum,saleNum&by=volumeEth&asc=-1&excludeWashTrading=-1`
      );

      nftgoData = (await nftgoData.json()).data.list.filter(v =>
        marketplaces.includes(v.name)
      );

      const labels = nftgoData.map(m => m.name);

      setData({
        volumes: {
          labels,
          values: nftgoData.map(m => m.volumeEth),
        },
        traders: {
          labels,
          values: nftgoData.map(m => m.traderNum),
        },
        leaderBoard: nftgoData,
      });
    })();
  }, [marketplaces, period]);

  return data;
};
