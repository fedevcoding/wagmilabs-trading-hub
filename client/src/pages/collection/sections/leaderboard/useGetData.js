import React from "react";
import { getFromServer } from "@Utils";

export function useGetData(address, sort, direction) {
  const [holders, setHolders] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await getFromServer(`/collection/${address}/get-holders?sort=${sort}&direction=${direction}`);
        const listHolders = data && data.holders ? data.holders : [];

        setHolders(listHolders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [address, sort, direction]);

  return { holders, loading };
}
