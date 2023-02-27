import { roundPrice, roundPrice2 } from "@Utils";

export function getRecap(data) {
  const paidData = data?.map(a => a.info.paid);
  const paid = {
    eth: data
      ? roundPrice(paidData?.map(a => a.eth).reduce((a, b) => a + b, 0))
      : 0,
    usd: data
      ? roundPrice2(paidData?.map(a => a.usd).reduce((a, b) => a + b, 0))
      : 0,
  };

  return { paid };
}
