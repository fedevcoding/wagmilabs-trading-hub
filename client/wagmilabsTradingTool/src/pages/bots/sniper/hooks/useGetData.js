import { getFromServer } from "@Utils";
import React, { useState, useEffect } from "react";

export const useGetData = () => {
  const [activeSnipes, setActiveSnipes] = useState(null);
  const [snipeActivity, setSnipeActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const url = "/userSnipeData";
        const data = await getFromServer(url);

        const { activeSnipes, snipeActivity } = data;
        setActiveSnipes(activeSnipes);
        setSnipeActivity(snipeActivity);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { activeSnipes, loading };
};
