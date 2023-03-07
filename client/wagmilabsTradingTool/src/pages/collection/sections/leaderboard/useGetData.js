import React from "react";
import { getFromServer } from "@Utils";

export function useGetData() {
  const [holders, setHolders] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const {
          data: { holders: listHolders },
        } = await getFromServer("/get-holders");

        setHolders(listHolders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { holders, loading };
}
