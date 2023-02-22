import React from "react";
import { fetchActivities } from "./functions";

function useInfinityScroll(infinityScrollEnabled, setLoadingMoreActivity) {
  React.useEffect(() => {
    const htmlElement = document.querySelector(".activity-table-container");
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = htmlElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        infinityScrollEnabled
      ) {
        setLoadingMoreActivity(true);
      }
    };
    htmlElement.addEventListener("scroll", handleScroll);
    return () => htmlElement.removeEventListener("scroll", handleScroll);
  }, [infinityScrollEnabled, setLoadingMoreActivity]);
}

export function useGetData(address, id, type) {
  const [activities, setActivities] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);
  const [loadingMoreActivity, setLoadingMoreActivity] = React.useState(false);

  const infinityScrollEnabled = activities?.continuation;

  useInfinityScroll(infinityScrollEnabled, setLoadingMoreActivity);

  React.useEffect(() => {
    if (loadingMoreActivity || !activities) {
      fetchActivities(
        loadingMoreActivity,
        type,
        infinityScrollEnabled,
        activities,
        address,
        id,
        setActivities,
        setLoading,
        setLoadingMoreActivity
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, id, type, loadingMoreActivity]);

  return { activities, isLoading, loadingMoreActivity };
}
