export function getTraderSortedValues(data) {
  const sortedData = data.sort((a, b) => (a.traderNum > b.traderNum ? -1 : 1));

  return {
    labels: sortedData.map(m => m.name),
    values: sortedData.map(m => m.traderNum),
  };
}
