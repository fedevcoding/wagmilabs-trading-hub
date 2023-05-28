import React from "react";
import { ListItemModal } from "@Components";

export const ListItem = React.memo(
  ({ details, address, id, currency, lastListing }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <>
        <div className="btn btn-list" onClick={() => setIsOpen(true)}>
          {lastListing ? "New Listing" : "Sell"}
        </div>
        <ListItemModal
          id={id}
          isOpen={isOpen}
          address={address}
          details={details}
          currency={currency}
          setIsOpen={setIsOpen}
          lastListing={lastListing}
        />
      </>
    );
  }
);
