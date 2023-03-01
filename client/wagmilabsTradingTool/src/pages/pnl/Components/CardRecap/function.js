import { roundPrice, roundPriceUsd } from "@Utils";

export function getRecap(data, taxPerc, taxedOn) {
  const paidData = data?.map(a => a.info.paid);
  const paid = {
    eth: data ? roundPrice(paidData?.map(a => a.eth).reduce((a, b) => a + b, 0)) : 0,
    usd: data ? roundPriceUsd(paidData?.map(a => a.usd).reduce((a, b) => a + b, 0)) : 0,
  };

  const pAndLData = data?.map(a => a.info.pOrL);
  const pAndL = {
    eth: data ? roundPrice(pAndLData?.map(a => a.eth).reduce((a, b) => a + b, 0)) : 0,
    usd: data ? roundPriceUsd(pAndLData?.map(a => a.usd).reduce((a, b) => a + b, 0)) : 0,
  };

  const soldData = data?.map(a => a.info.sold);
  const sold = {
    eth: data ? roundPrice(soldData?.map(a => a.eth).reduce((a, b) => a + b, 0)) : 0,
    usd: data ? roundPriceUsd(soldData?.map(a => a.usd).reduce((a, b) => a + b, 0)) : 0,
  };

  const grossData = data?.map(a => a.info.gross);
  const gross = {
    eth: data ? roundPrice(grossData?.map(a => a.eth).reduce((a, b) => a + b, 0)) : 0,
    usd: data ? roundPriceUsd(grossData?.map(a => a.usd).reduce((a, b) => a + b, 0)) : 0,
  };

  const taxes =
    taxedOn === "gross"
      ? {
          eth: (gross.eth / 100) * taxPerc,
          usd: (gross.usd / 100) * taxPerc,
        }
      : {
          eth: pAndL.eth > 0 ? (pAndL.eth / 100) * taxPerc : 0,
          usd: pAndL.usd > 0 ? (pAndL.usd / 100) * taxPerc : 0,
        };

  return { paid, sold, pAndL, taxes };
}
