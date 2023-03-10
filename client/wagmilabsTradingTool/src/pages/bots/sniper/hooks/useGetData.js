import { getFromServer } from "@Utils";
import { useState, useEffect } from "react";

export const useGetData = () => {
  const [activeSnipes, setActiveSnipes] = useState(null);
  const [snipeActivity, setSnipeActivity] = useState(null);
  const [loadingSnipes, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const url = "/bots/sniper/getTasks";
        const { tasks, activities } = await getFromServer(url);

        setActiveSnipes(tasks);
        setSnipeActivity(activities);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { activeSnipes, loadingSnipes, setActiveSnipes, snipeActivity };
};
