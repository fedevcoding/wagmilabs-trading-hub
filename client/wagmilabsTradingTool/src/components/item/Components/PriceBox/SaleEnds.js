import moment from "moment";
import React from "react";

export const SaleEnds = React.memo(({ validUntil }) => {
  return (
    (validUntil && (
      <p className="valid-until">
        <i className="fa fa-clock" />
        {"Sale ends "}
        {moment(validUntil * 1000).format("MMM DD, YYYY HH:mm")}
      </p>
    )) || <></>
  );
});
