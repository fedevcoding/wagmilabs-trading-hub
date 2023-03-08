import React from "react";
import { getFromServer } from "@Utils";

export function useGetData(address) {
  const [holders, setHolders] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const {
          data: { holders: listHolders },
        } = await getFromServer(`/collection/${address}/get-holders`);

        setHolders(listHolders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [address]);

  return { holders, loading };
}
