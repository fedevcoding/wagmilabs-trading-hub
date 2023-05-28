import { baseUrl } from "@Variables";
import { roundPrice2 } from "@Utils/formats/formats";
import moment from "moment";

export const periods = ["24h", "7d", "30d", "3M", "1y", "all"].map(p => ({
  value: p,
  label: p,
}));

export const activityTypeMapping = {
  ask: "List",
  sale: "Sale",
  transfer: "Transfer",
  mint: "Mint",
  bid: "Offer",
  bid_cancel: "Offer Cancel",
  ask_cancel: "List Cancel",
};

export const getChartData = async (
  address,
  chartPeriod,
  setLoadingChart,
  setActivityChartData
) => {
  setLoadingChart(true);

  let data = await fetch(
    `${baseUrl}/activityChart/${address}?chart-period=${chartPeriod}`,
    {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken,
      },
    }
  );

  data = await data.json();

  const averagePrices = data.map(item => roundPrice2(item.averageprice));
  const volumes = data.map(item => roundPrice2(item.volume));

  let days;
  if (chartPeriod === "24h") {
    days = data.map(item => moment(item.day).format("DD/MM hh:mm"));
  } else {
    days = data.map(item => moment(item.day).format("DD/MM/YYYY"));
  }

  const sales = data.map(item => item.sales);

  setActivityChartData({
    averagePrices: averagePrices,
    volumes: volumes,
    sales,
    days,
  });
  setLoadingChart(false);
};

export const getActivityData = async (
  address,
  setCollectionActivityLoading,
  collectuonActivityFilter,
  activityContinuation,
  setCollectionActivity
) => {
  try {
    setCollectionActivityLoading(true);

    const filters = collectuonActivityFilter.join("-");

    let data = await fetch(
      `${baseUrl}/collectionActivity/${address}?types=${filters}`,
      {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      }
    );
    if (!data.ok) throw new Error("Error getting activity data");
    data = await data.json();

    const { continuation, activities } = data;

    activityContinuation.current = continuation;

    setCollectionActivity(activities);
    setCollectionActivityLoading(false);
  } catch (e) {
    console.log(e);
    activityContinuation.current = null;
    setCollectionActivity([]);
    setCollectionActivityLoading(false);
  }
};

export const changeActivityFilter = (
  type,
  collectuonActivityFilter,
  setCollectionActivityFilter
) => {
  if (collectuonActivityFilter.includes(type)) {
    const newFilter = collectuonActivityFilter.filter(item => item !== type);
    setCollectionActivityFilter(newFilter);
  } else {
    setCollectionActivityFilter([...collectuonActivityFilter, type]);
  }
};

export const getMoreActivity = async (
  address,
  setLoadingMoreActivity,
  collectuonActivityFilter,
  activityContinuation,
  setCollectionActivity,
  setCollectionActivityLoading
) => {
  try {
    setLoadingMoreActivity(true);

    const filters = collectuonActivityFilter.join("-");
    const continuationFilter = activityContinuation.current
      ? `&continuation=${activityContinuation.current}`
      : "";

    let data = await fetch(
      `${baseUrl}/collectionActivity/${address}?types=${filters}${continuationFilter}`,
      {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      }
    );
    if (!data.ok) throw new Error("Error getting activity data");
    data = await data.json();

    const { continuation, activities } = data;

    activityContinuation.current = continuation;

    setCollectionActivity(prev => [...prev, ...activities]);
    setCollectionActivityLoading(false);
  } catch (e) {
    console.log(e);
    activityContinuation.current = null;
    setCollectionActivityLoading(false);
  }
};
