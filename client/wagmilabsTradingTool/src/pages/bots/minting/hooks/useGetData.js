import { getFromServer } from "@Utils";
import { useState, useEffect } from "react";

export const useGetData = () => {
  const [activeMints, setActiveMints] = useState(null);
  const [mintsActivity, setMintingActivity] = useState(null);
  const [loadingMints, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const url = "/bots/minting/getTasks";
        const { tasks, activities } = await getFromServer(url);

        setActiveMints(tasks);
        setMintingActivity(activities);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { activeMints, loadingMints, setActiveMints, mintsActivity };
};
