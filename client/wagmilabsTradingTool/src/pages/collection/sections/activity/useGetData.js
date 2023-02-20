import { useEffect, useRef, useState } from "react";
import { getActivityData, getChartData, getMoreActivity } from "./functions";

export const useGetData = address => {
  const [loadingMoreActivity, setLoadingMoreActivity] = useState(false);
  const activityContinuation = useRef();
  const observer = useRef(null);

  const [activityChartData, setActivityChartData] = useState({});
  const [loadingChart, setLoadingChart] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("24h");

  const [collectionActivity, setCollectionActivity] = useState([]);
  const [collectionActivityLoading, setCollectionActivityLoading] =
    useState(true);

  const [collectuonActivityFilter, setCollectionActivityFilter] = useState([
    "sale",
  ]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && activityContinuation.current) {
        getMoreActivity(
          address,
          setLoadingMoreActivity,
          collectuonActivityFilter,
          activityContinuation,
          setCollectionActivity,
          setCollectionActivityLoading
        );
      }
    }, options);

    const target = document.querySelector(
      ".collection-activity-single-container.last-token"
    );
    if (target) {
      observer.current.observe(target);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionActivity]);

  useEffect(() => {
    getChartData(address, chartPeriod, setLoadingChart, setActivityChartData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartPeriod]);

  useEffect(() => {
    getActivityData(
      address,
      setCollectionActivityLoading,
      collectuonActivityFilter,
      activityContinuation,
      setCollectionActivity
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectuonActivityFilter]);

  return {
    loadingChart,
    collectuonActivityFilter,
    setCollectionActivityFilter,
    chartPeriod,
    setChartPeriod,
    activityChartData,
    collectionActivity,
    collectionActivityLoading,
    loadingMoreActivity,
  };
};
