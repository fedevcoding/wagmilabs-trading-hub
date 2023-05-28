import { LoadingSpinner } from "@Components";
import React from "react";

export const LoadingMoreActivity = () => (
  <tr>
    <td colSpan={6}>
      <LoadingSpinner>
        <p>Loading more activity...</p>
      </LoadingSpinner>
    </td>
  </tr>
);
