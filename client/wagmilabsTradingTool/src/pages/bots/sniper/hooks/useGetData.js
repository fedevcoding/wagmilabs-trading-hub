import { getFromServer } from "@Utils";
import { useState, useEffect } from "react";

export const useGetData = () => {
  const [activeSnipes, setActiveSnipes] = useState(null);
  const [snipeActivity, setSnipeActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const url = "/bots/sniper/getTasks";
        const tasks = await getFromServer(url);

        setActiveSnipes(tasks);
        /*
        const { activeSnipes, snipeActivity } = data;
        setActiveSnipes(activeSnipes);
        setSnipeActivity(snipeActivity);
        */
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { activeSnipes, loading, setActiveSnipes };
};
