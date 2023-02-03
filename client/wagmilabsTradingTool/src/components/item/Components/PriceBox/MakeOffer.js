import React from "react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";

export const MakeOffer = React.memo(({ details, address }) => {
  const [insertOffer, setInsertOffer] = React.useState(false);

  return insertOffer ? (
    <div className="btn insert-bid">
      <div className="back" onClick={() => setInsertOffer(!insertOffer)}>
        <i className="fa fa-arrow-left" />
      </div>
      <NumberInput>
        <NumberInputField placeholder="Insert ETH amount" />
      </NumberInput>
      <div className="make-offer">
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
