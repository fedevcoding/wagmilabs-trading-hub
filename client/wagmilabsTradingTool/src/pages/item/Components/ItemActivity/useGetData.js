import React from "react";
import { fetchActivities } from "./functions";

function useInfinityScroll(infinityScrollEnabled, setLoadingMoreActivity) {
  React.useEffect(() => {
    const htmlElement = document.querySelector(".activity-table-container");
    if (htmlElement) {
      const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = htmlElement;
        if (scrollTop + clientHeight >= scrollHeight - 100 && infinityScrollEnabled) {
          setLoadingMoreActivity(true);
        }
      };
      htmlElement.addEventListener("scroll", handleScroll);
      return () => htmlElement.removeEventListener("scroll", handleScroll);
    }
  }, [infinityScrollEnabled, setLoadingMoreActivity]);
}

export function useGetData(address, id, type, filtering, setFiltering) {
  const [activities, setActivities] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);
  const [loadingMoreActivity, setLoadingMoreActivity] = React.useState(false);

  const infinityScrollEnabled = activities?.continuation;

  useInfinityScroll(infinityScrollEnabled, setLoadingMoreActivity);

  React.useEffect(() => {
    if (loadingMoreActivity || !activities || filtering) {
      fetchActivities(
        loadingMoreActivity,
        type,
        infinityScrollEnabled,
        filtering ? { activities: [] } : activities,
        address,
        id,
        setActivities,
        setLoading,
        setLoadingMoreActivity
      );
      if (filtering) {
        setFiltering(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, id, type, filtering, setFiltering, loadingMoreActivity]);

  return { activities, isLoading, loadingMoreActivity };
}
