import React from "react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { getEthPrice, getPriceByProfit, listItem } from "./functions";

import "./style.css";

export const ListItem = React.memo(({ details, address, id }) => {
  const [ethAmountPrice, setEthAmountPrice] = React.useState(null);
  const [priceWithProfit, setPriceWithProfit] = React.useState(null);

  const lastBuyPrice = details?.token?.lastBuy?.value;

  return (
    <div className="list-item">
      <h2>List item</h2>
      <div className="list-row">
        <div className="point">•</div>
        <div className="price-method">
          <NumberInput>
            <NumberInputField
              placeholder="Insert ETH amount"
              onChange={e => setEthAmountPrice(getEthPrice(e.target.value))}
            />
          </NumberInput>
        </div>
        <div
          className="btn btn-list"
          onClick={() => listItem(ethAmountPrice, "eth-amount")}
        >
          List
        </div>
      </div>
      {(lastBuyPrice && (
        <>
          <div className="list-row">
            <div className="point">•</div>
            <div className="price-method">Break even</div>
            <div
              className="btn btn-list"
              onClick={() => listItem(lastBuyPrice, "break-even")}
            >
              List
            </div>
          </div>
          <div className="list-row">
            <div className="point">•</div>
            <div className="price-method">
              <NumberInput>
                <NumberInputField
                  placeholder="Insert % of profit"
                  onChange={e =>
                    setPriceWithProfit(
                      getPriceByProfit(e.target.value, lastBuyPrice)
                    )
                  }
                />
              </NumberInput>
            </div>
            <div
              className="btn btn-list"
              onClick={() => listItem(priceWithProfit, "profit")}
            >
              List
            </div>
          </div>
        </>
      )) ||
        ""}
    </div>
  );
});
