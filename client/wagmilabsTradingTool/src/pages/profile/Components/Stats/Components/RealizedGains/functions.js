export function addingProfit(rows) {
  return rows.map(r => ({
    ...r,
    profit: r.sold.eth_price - r.sold.fee - r.bought.eth_price - r.bought.fee - r.minted.eth_price - r.minted.fee,
  }));
}
