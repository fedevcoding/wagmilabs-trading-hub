import React from "react";
import { getTraderSortedValues, getVolumesSortedValues } from "./functions";
import baseUrl from "../../../../variables/baseUrl";

export const useGetData = (marketplaces, period) => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    (async () => {
      let data = await fetch(
        `${baseUrl}/volumes/overview?period=${period}&marketplaces=${marketplaces.join()}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      data = await data.json();

      console.log(data);

      const nftGoPath = "https://api.nftgo.io/api/v1/ranking/marketplace-list";

      let nftgoData = await fetch(
        `${nftGoPath}?limit=100&offset=0&range=${period}&fields=volume,volumeEth,traderNum,saleNum&by=volumeEth&asc=-1&excludeWashTrading=-1`
      );

      nftgoData = (await nftgoData.json()).data.list.filter(v =>
        marketplaces.includes(v.name)
      );

      console.log(nftgoData);

      const traders = getTraderSortedValues(nftgoData);
      const volumes = getVolumesSortedValues(data);

      setData({
        volumes,
        traders,
        leaderBoard: nftgoData,
      });
    })();
  }, [marketplaces, period]);

  return data;
};
