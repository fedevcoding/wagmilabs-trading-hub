export function getListSort() {
  return [
    {
      value: "collection_gains_all_time",
      label: "Top Profit takers",
    },
    {
      value: "collection_volume_wei_1d",
      label: "Top Volume creators (1D)",
    },
    {
      value: "collection_volume_wei_7d",
      label: "Top Volume creators (7D)",
    },
    {
      value: "collection_volume_wei_30d",
      label: "Top Volume creators (30D)",
    },
    {
      value: "collection_volume_wei_all_time",
      label: "Top Volume creators (All Time)",
    },
    {
      value: "collection_assets_owned",
      label: "Top Holders",
    },
  ];
}

export function getDirections() {
  return [
    {
      value: "ASC",
      label: "Ascending",
    },
    {
      value: "DESC",
      label: "Descending",
    },
  ];
}
