import React from "react";

export const MakeOffer = React.memo(({ details, address }) => {
  return (
    <div className="btn">
      <i className="fa fa-tag" />
      Make offer
    </div>
  );
});
