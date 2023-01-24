export function getTraderSortedValues(data) {
  const sortedData = data.sort((a, b) => (a.traderNum > b.traderNum ? -1 : 1));

  return {
    labels: sortedData.map(m => m.name),
    values: sortedData.map(m => m.traderNum),
  };
}

export function getVolumesSortedValues(data) {
  const sortedData = data.sort((a, b) => (a.volumeEth > b.volumeEth ? -1 : 1));

  return {
    labels: sortedData.map(m => m.name),
    values: sortedData.map((m, i) => ({
      x: i,
      y: +m.volumeEth.toFixed(2),
      secondValue: parseInt(m.volume).toLocaleString("EN-us"),
    })),
  };
}
