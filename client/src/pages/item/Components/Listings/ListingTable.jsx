import React from "react";
import { TableRow } from "./TableRow";

export const ListingTable = React.memo(({ listings, address, details }) => {
  const hasAmount = details.token.kind === "erc1155";

  return (
    <table>
      <thead>
        <tr>
          <th>Unit Price</th>
          <th>USD Unit Price</th>
          {hasAmount ? <th>Quantity</th> : <></>}
          <th>From</th>
          <th>Expiration</th>
          <th className="row-action" />
        </tr>
      </thead>
      <tbody>
        {(listings || []).map(a => (
          <TableRow
            key={Object.values(a)
              .filter(v => typeof v === "string")
              .join()}
            listing={a}
            address={address}
            details={details}
          />
        ))}
      </tbody>
    </table>
  );
});
