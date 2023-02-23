import React from "react";

export const Table = React.memo(() => {
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
        <tr>
          <td>NFT #123</td>
          <td>$500</td>
          <td>$1,000</td>
          <td>$50</td>
          <td>$450</td>
          <td>2 months</td>
          <td>$950</td>
          <td>$130</td>
        </tr>
      </tbody>
    </table>
  );
});
