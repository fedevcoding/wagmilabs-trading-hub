export function addingProfit(rows) {
  return rows.map(r => ({
    ...r,
    profit: r.sold.eth_price - r.sold.fee - r.bought.eth_price - r.bought.fee - r.minted.eth_price - r.minted.fee,
  }));
}

export const sortRows = (rows, column, order) => {
  const compareFn = (a, b) => {
    let aValue, bValue;

    switch (column) {
      case "bought-count":
        aValue = a.bought.count;
        bValue = b.bought.count;
        break;
      case "bought-price":
        aValue = a.bought.eth_price;
        bValue = b.bought.eth_price;
        break;
      case "sold-count":
        aValue = a.sold.count;
        bValue = b.sold.count;
        break;
      case "sold-price":
        aValue = a.sold.eth_price;
        bValue = b.sold.eth_price;
        break;
      case "minted-count":
        aValue = a.minted.count;
        bValue = b.minted.count;
        break;
      case "minted-price":
        aValue = a.minted.eth_price;
        bValue = b.minted.eth_price;
        break;
      case "profit":
        aValue = a.profit;
        bValue = b.profit;
        break;

      default:
        break;
    }

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    } else if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  };

  return addingProfit(rows).sort(compareFn);
};

export const sortOptions = [
  {
    value: "bought-count",
    label: "Bought Count",
  },
  {
    value: "bought-price",
    label: "Bought Price",
  },
  {
    value: "sold-count",
    label: "Sold Count",
  },
  {
    value: "sold-price",
    label: "Sold Price",
  },
  {
    value: "minted-count",
    label: "Mint Count",
  },
  {
    value: "minted-price",
    label: "Mint Price",
  },
  {
    value: "profit",
    label: "Realized Gains",
  },
];
