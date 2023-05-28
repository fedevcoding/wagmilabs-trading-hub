import React from "react";
import { AcceptOfferModal } from "@Components";

export const AcceptOffer = React.memo(({ details, address }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const topBid = details?.market?.topBid;
  const tokenId = details?.token?.tokenId || "";

  return (
    <>
      <div className="btn" onClick={() => setIsOpen(true)}>
        <i className="fa fa-check" />
        Accept offer
      </div>
      <AcceptOfferModal
        details={details}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        address={address}
        tokenId={tokenId}
        bid={topBid}
      />
    </>
  );
});
