import { roundPrice, roundPriceUsd } from "@Utils";

export function getRecap(data, taxPerc, taxedOn, taxLossHarvesting) {
  const paidData = data?.map(a => a.info.paid) || [];
  const paid = {
    eth: data ? roundPrice(paidData?.map(a => a.eth).reduce((a, b) => a + b, 0)) : 0,
    usd: data ? roundPriceUsd(paidData?.map(a => a.usd).reduce((a, b) => a + b, 0)) : 0,
  };

  const pAndLData = data?.map(a => a.info.pOrL) || [];
  const pAndL = {
    eth: data ? pAndLData?.map(a => a.eth).reduce((a, b) => a + b, 0) : 0,
    usd: data ? pAndLData?.map(a => a.usd).reduce((a, b) => a + b, 0) : 0,
  };

  const soldData = data?.map(a => a.info.sold) || [];
  const sold = {
    eth: data ? roundPrice(soldData?.map(a => a.eth).reduce((a, b) => a + b, 0)) : 0,
    usd: data ? roundPriceUsd(soldData?.map(a => a.usd).reduce((a, b) => a + b, 0)) : 0,
  };

  const grossData = data?.map(a => a.info.gross) || [];
  const gross = {
    eth: data ? roundPrice(grossData?.map(a => a.eth).reduce((a, b) => a + b, 0)) : 0,
    usd: data ? roundPriceUsd(grossData?.map(a => a.usd).reduce((a, b) => a + b, 0)) : 0,
  };

  let taxes;
  if (taxLossHarvesting) {
    const valueToBeTaxed = taxedOn === "gross" ? gross : pAndL;
    taxes = {
      eth: roundPrice(valueToBeTaxed.eth > 0 ? (valueToBeTaxed.eth / 100) * taxPerc : 0),
      usd: roundPriceUsd(valueToBeTaxed.usd > 0 ? (valueToBeTaxed.usd / 100) * taxPerc : 0),
    };
  } else {
    const listValues = data?.map(a => a.info[taxedOn === "gross" ? "gross" : "pOrL"]) || [];
    const taxesEth = listValues?.map(a => (a.eth > 0 ? (a.eth / 100) * taxPerc : 0)).reduce((a, b) => a + b, 0);
    const taxesUsd = listValues?.map(a => (a.usd > 0 ? (a.usd / 100) * taxPerc : 0)).reduce((a, b) => a + b, 0);

    taxes = {
      eth: roundPrice(taxesEth > 0 ? taxesEth : 0),
      usd: roundPriceUsd(taxesUsd > 0 ? taxesUsd : 0),
    };
  }

  return { paid, sold, pAndL, taxes };
}
