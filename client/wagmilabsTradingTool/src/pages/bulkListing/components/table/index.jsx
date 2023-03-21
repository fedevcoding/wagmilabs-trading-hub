import React from "react";
import Item from "./Item";

const Table = React.memo(({ items, setMarketplace, changeListPrice }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>NFT</th>
          <th>marketplace</th>
          <th>List price</th>
          <th>Marketplace fee</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          return <Item key={index} item={item} setMarketplace={setMarketplace} changeListPrice={changeListPrice} />;
        })}
      </tbody>
    </table>
  );
});

export { Table };
