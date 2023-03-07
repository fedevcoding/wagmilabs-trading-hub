import { roundPrice, roundPriceUsd } from "@Utils";
import { longTermDays } from "@Variables";

export function getRecap(data, taxPerc, taxedOn, taxLossHarvesting, longTermTax) {
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
    if (longTermTax === undefined) {
      const valueToBeTaxed = taxedOn === "gross" ? gross : pAndL;
      taxes = {
        eth: roundPrice(valueToBeTaxed.eth > 0 ? (valueToBeTaxed.eth / 100) * taxPerc : 0),
        usd: roundPriceUsd(valueToBeTaxed.usd > 0 ? (valueToBeTaxed.usd / 100) * taxPerc : 0),
      };
    } else {
      const longTermItems = data?.filter(a => Math.abs(a.info.holdDuration) > longTermDays * 3600 * 24);
      const shortTermItems = data?.filter(a => Math.abs(a.info.holdDuration) <= longTermDays * 3600 * 24);
      const longTermData = longTermItems?.map(a => a.info[taxedOn === "gross" ? "gross" : "pOrL"]) || [];
      const shortTermData = shortTermItems?.map(a => a.info[taxedOn === "gross" ? "gross" : "pOrL"]) || [];
      const longTermTaxes = {
        eth: data ? (longTermData?.map(a => a.eth).reduce((a, b) => a + b, 0) / 100) * longTermTax : 0,
        usd: data ? (longTermData?.map(a => a.usd).reduce((a, b) => a + b, 0) / 100) * longTermTax : 0,
      };
      const shortTermTaxes = {
        eth: data ? (shortTermData?.map(a => a.eth).reduce((a, b) => a + b, 0) / 100) * taxPerc : 0,
        usd: data ? (shortTermData?.map(a => a.usd).reduce((a, b) => a + b, 0) / 100) * taxPerc : 0,
      };
      const taxesEth = longTermTaxes.eth + shortTermTaxes.eth;
      const taxesUsd = longTermTaxes.usd + shortTermTaxes.usd;
      taxes = {
        eth: roundPrice(taxesEth < 0 ? 0 : taxesEth),
        usd: roundPriceUsd(taxesUsd < 0 ? 0 : taxesUsd),
      };
    }
  } else {
    const taxesEth = data
      ?.map(a => {
        const objToBeTaxed = a.info[taxedOn === "gross" ? "gross" : "pOrL"];
        const applyLongTermTax = longTermTax !== undefined && Math.abs(a.info.holdDuration) > longTermDays * 3600 * 24;
        const taxPercToApply = applyLongTermTax ? longTermTax : taxPerc;
        return objToBeTaxed.eth > 0 ? (objToBeTaxed.eth / 100) * taxPercToApply : 0;
      })
      .reduce((a, b) => a + b, 0);

    const taxesUsd = data
      ?.map(a => {
        const objToBeTaxed = a.info[taxedOn === "gross" ? "gross" : "pOrL"];
        const applyLongTermTax = longTermTax !== undefined && Math.abs(a.info.holdDuration) > longTermDays * 3600 * 24;
        const taxPercToApply = applyLongTermTax ? longTermTax : taxPerc;
        return objToBeTaxed.usd > 0 ? (objToBeTaxed.usd / 100) * taxPercToApply : 0;
      })
      .reduce((a, b) => a + b, 0);

    taxes = {
      eth: roundPrice(taxesEth > 0 ? taxesEth : 0),
      usd: roundPriceUsd(taxesUsd > 0 ? taxesUsd : 0),
    };
  }

  return { paid, sold, pAndL, taxes };
}
