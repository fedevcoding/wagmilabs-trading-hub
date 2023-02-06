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
