import { baseUrl } from "@Variables";

export function getActivityOptions() {
  return {
    transfer: "Transfer",
    sale: "Sale",
    ask: "List",
    mint: "Minted",
    bid: "Offer",
    bid_cancel: "Offer canceled",
    ask_cancel: "List canceled",
  };
}

export function fetchActivities(
  loadingMoreActivity,
  type,
  infinityScrollEnabled,
  activities,
  address,
  id,
  setActivities,
  setLoading,
  setLoadingMoreActivity
) {
  (async () => {
    if (!loadingMoreActivity) setLoading(true);

    const params = {};
    if (type) {
      params.types = type;
    }
    if (infinityScrollEnabled) {
      params.continuation = activities.continuation;
    }

    let apiData = await fetch(
      `${baseUrl}/collection/${address}/token/${id}/activities?${new URLSearchParams(params).toString()}`,
      {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      }
    );

    apiData = await apiData.json();

    setActivities(
      activities
        ? {
            activities: activities.activities.concat(apiData.activities),
            continuation: apiData.continuation,
          }
        : apiData
    );
    if (!loadingMoreActivity) setLoading(false);
    else setLoadingMoreActivity(false);
  })();
}
