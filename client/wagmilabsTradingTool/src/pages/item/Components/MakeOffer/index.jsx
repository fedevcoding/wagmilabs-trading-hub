import React from "react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { usePlaceBid } from "../../../../custom-hooks";

export const MakeOffer = React.memo(({ address, tokenId, marketplace }) => {
  const [insertOffer, setInsertOffer] = React.useState(false);
  const [price, setPrice] = React.useState(0);

  const { placeBid } = usePlaceBid(marketplace);

  return insertOffer ? (
    <div className="btn insert-bid">
      <div className="back" onClick={() => setInsertOffer(!insertOffer)}>
        <i className="fa fa-arrow-left" />
      </div>
      <NumberInput>
        <NumberInputField
          placeholder="Value"
          onChange={e => setPrice(e.target.value)}
        />
      </NumberInput>
      <div
        className="make-offer"
        onClick={() => placeBid(`${address}:${tokenId}`, price)}
      >
        <i className="fa fa-tag" />
        Confirm
      </div>
    </div>
  ) : (
    <div className="btn" onClick={() => setInsertOffer(!insertOffer)}>
      <i className="fa fa-tag" />
      Make offer
    </div>
  );
});
