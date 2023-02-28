import React from "react";
import { useImages } from "./useImages";
import { Row } from "./Row";

export const Table = React.memo(({ data, taxPerc, taxedOn, currency }) => {
  const { images, isFetchingInitialData } = useImages(data);

  return (
    <table>
      <thead>
        <tr>
          <th>NFT</th>
          <th>Paid</th>
          <th>Sold</th>
          <th>Gas fees</th>
          <th>P&L</th>
          <th>Hold duration</th>
          <th>Gross profit</th>
          <th>Taxes owed</th>
        </tr>
      </thead>
      <tbody>
        {data.map(n => (
          <Row
            key={JSON.stringify(n)}
            nft={n.info}
            taxPerc={taxPerc}
            taxedOn={taxedOn}
            currency={currency}
            images={images}
            isFetchingInitialData={isFetchingInitialData}
          />
        ))}
      </tbody>
    </table>
  );
});
