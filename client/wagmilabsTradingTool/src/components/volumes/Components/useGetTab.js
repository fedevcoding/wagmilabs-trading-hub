import React from "react";

export function useGetTab(marketplaces) {
  let urlTab = null;
  if (
    window.location.hash &&
    marketplaces
      .map(m => m.toLowerCase())
      .includes(window.location.hash.substring(1))
  ) {
    urlTab = marketplaces.find(
      m => m.toLowerCase() === window.location.hash.substring(1)
    );
  }
  const [tab, setTab] = React.useState(urlTab || "Overview");

  return [tab, setTab];
}
