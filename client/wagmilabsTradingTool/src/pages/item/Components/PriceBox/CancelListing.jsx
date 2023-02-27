import React from "react";
import { useCancelListing } from "@Hooks";

export const CancelListing = React.memo(({ listingId }) => {
  const { cancelListing } = useCancelListing(listingId);

  return (
    <div className="btn" onClick={() => cancelListing()}>
      <i className="fa fa-cart-minus" />
      Cancel listing
    </div>
  );
});
