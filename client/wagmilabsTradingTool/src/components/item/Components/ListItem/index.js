import React from "react";
import { ListItemModal } from "./ListItemModal";

import "./style.scss";

export const ListItem = React.memo(({ details, address, id, currency }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div className="btn btn-list" onClick={() => setIsOpen(true)}>
        Sell
      </div>
      <ListItemModal
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
