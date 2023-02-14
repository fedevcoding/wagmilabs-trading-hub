import React from "react";

export const CurrentPrice = React.memo(({ market }) => {
  return (
    <>
      <p className="current-price">
        {(market?.quantityRemaining && (
          <>
            <small>{`Quantity remaining: ${market.quantityRemaining}`}</small>
            <br />
          </>
        )) ||
          ""}
        Current price
      </p>
      <div className="price">
        {market.price.amount.decimal} {market.price.currency.symbol}
        <small>
          $
          {market.price.amount.usd.toLocaleString("EN-us", {
            maximumFractionDigits: 2,
          })}
        </small>
      </div>
    </>
  );
});
