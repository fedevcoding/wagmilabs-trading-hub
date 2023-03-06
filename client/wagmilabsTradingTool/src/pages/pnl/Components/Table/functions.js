import { roundPrice, roundPriceUsd } from "@Utils";

export function getTaxValue(nft, taxedOn, currency, taxPerc, longTermTax) {
  const symbol = currency === "usd" ? "$" : " ETH";
  const longTermDays = 365;
  const valueToBeTaxed = (taxedOn === "net" ? nft.pOrL : nft.gross)[currency];
  const applyLongTermTax = longTermTax !== undefined && Math.abs(nft.holdDuration) > longTermDays * 3600 * 24;
  let approxedValue;

  if (valueToBeTaxed >= 0) {
    const taxPercToApply = applyLongTermTax ? longTermTax : taxPerc;

    approxedValue =
      currency === "usd"
        ? roundPriceUsd((valueToBeTaxed / 100) * taxPercToApply)
        : roundPrice((valueToBeTaxed / 100) * taxPercToApply);
  } else {
    approxedValue = "0.00";
  }

  return approxedValue + symbol;
}
