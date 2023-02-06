export function getEthPrice(price, method) {
  return price;
}

export function getPriceByProfit(percentage, lastBuyPrice) {
  let price = lastBuyPrice;

  if (!isNaN(Number(percentage)) && percentage !== 0) {
    price = price + (lastBuyPrice / 100) * parseFloat(percentage);
  }

  if (price > 0) {
    return price;
  } else {
    alert("The price cannot be less than 0");
  }

  return lastBuyPrice;
}

export const listItem = (price, method) => {
  if (!price) {
    let msg = null;
    switch (method) {
      case "eth-amount":
        msg = "Please insert ETH amount";
        break;
      case "profit":
        msg = "Please insert % of profit";
        break;
      default:
        break;
    }
    if (msg) {
      alert(msg);
    }
  }

  console.log("list price", price);
};
