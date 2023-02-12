export function getEvent(type) {
  switch (type) {
    case "ask":
      return "List";
    case "mint":
      return "Minted";
    case "bid":
      return "Offer";
    default:
      break;
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getActivityOptions() {
  return {
    sale: "Sale",
    ask: "List",
    mint: "Minted",
    bid: "Offer",
    bid_cancel: "Offer canceled",
    ask_cancel: "List canceled",
  };
}
