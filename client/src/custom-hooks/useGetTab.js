import React from "react";

export function useGetTab(tabs, defaultTab) {
  let urlTab = null;
  if (
    window.location.hash &&
    tabs.map(m => m.toLowerCase()).includes(window.location.hash.substring(1))
  ) {
    urlTab = tabs.find(
      m => m.toLowerCase() === window.location.hash.substring(1)
    );
  }
  const [tab, setTab] = React.useState(urlTab || defaultTab);

  return [tab, setTab];
}
