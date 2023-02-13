import React from "react";
import { TransferItemModal } from "@Components";

export const TransferItem = React.memo(({ details, address, id, currency }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div className="btn btn-transfer" onClick={() => setIsOpen(true)}>
        <i className="fa fa-exchange-alt" />
        Transfer
      </div>
      <TransferItemModal
        details={details}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        address={address}
        id={id}
        currency={currency}
      />
    </>
  );
});
