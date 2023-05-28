import React from "react";
import Hr from "./Hr";
const TableHr = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan}>
        <Hr />
      </td>
    </tr>
  );
};

export default TableHr;
