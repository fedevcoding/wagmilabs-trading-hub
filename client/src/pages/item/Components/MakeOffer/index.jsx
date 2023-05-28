import React from "react";
import { MakeOfferModal } from "@Components";

export const MakeOffer = React.memo(
  ({ address, tokenId, marketplace, details, currency }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <>
        <div className="btn" onClick={() => setIsOpen(true)}>
          <i className="fa fa-tag" />
          Make offer
        </div>
        <MakeOfferModal
          isOpen={isOpen}
          address={address}
          details={details}
          tokenId={tokenId}
          currency={currency}
          setIsOpen={setIsOpen}
          marketplace={marketplace}
        />
      </>
    );
  }
);
