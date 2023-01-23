import React from "react";
import { getTraderSortedValues } from "./functions";

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
        `${nftGoPath}?limit=100&offset=0&range=${period.toLowerCase()}&fields=volume,volumeEth,traderNum,saleNum&by=volumeEth&asc=-1&excludeWashTrading=-1`
      );

      nftgoData = (await nftgoData.json()).data.list.filter(v =>
        marketplaces.includes(v.name)
      );

      const labels = nftgoData.map(m => m.name);

      const traders = getTraderSortedValues(nftgoData);

      setData({
        volumes: {
          labels,
          values: nftgoData.map((m, i) => ({
            x: i + 1,
            y: +m.volumeEth.toFixed(2),
            secondValue: parseInt(m.volume).toLocaleString("EN-us"),
          })),
        },
        traders: traders,
        leaderBoard: nftgoData,
      });
    })();
  }, [marketplaces, period]);

  return data;
};
