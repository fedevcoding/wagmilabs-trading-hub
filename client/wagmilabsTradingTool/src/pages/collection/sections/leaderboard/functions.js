export function getListSort() {
  return [
    {
      value: "collection_gains_1d",
      label: "Collection gains 1d",
    },
    {
      value: "collection_gains_7d",
      label: "Collection gains 7d",
    },
    {
      value: "collection_gains_30d",
      label: "Collection gains 30d",
    },
    {
      value: "collection_gains_all_time",
      label: "Collection gains all time",
    },
    {
      value: "collection_volume_wei_1d",
      label: "Collection volume 1d",
    },
    {
      value: "collection_volume_wei_7d",
      label: "Collection volume 7d",
    },
    {
      value: "collection_volume_wei_30d",
      label: "Collection volume 30d",
    },
    {
      value: "collection_volume_wei_all_time",
      label: "Collection volume all time",
    },
    {
      value: "collection_assets_owned",
      label: "Collection assets owned",
    },
    {
      value: "collection_portfolio_wei",
      label: "Collection portfolio volume",
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
