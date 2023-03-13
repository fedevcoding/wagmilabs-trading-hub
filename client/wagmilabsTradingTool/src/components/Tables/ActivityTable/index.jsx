import React from "react";
import { CollectionActivityMapping } from "./CollectionActivityMapping";
import { LoadingMoreActivity } from "./LoadingMoreActivity";

import "./style.scss";

export const ActivityTable = ({ collectionActivityLoading, collectionActivity, address, loadingMoreActivity }) => {
  return (
    <div className="collection-activity-table-container">
      <table className="collection-activity-table">
        <thead>
          <tr>
            <th>Type</th>
            <th className="collection-activity-tr-item">Item</th>
            <th>Price</th>
            <th>From</th>
            <th>To</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {collectionActivityLoading ? (
            <LoadingMoreActivity />
          ) : (
            <CollectionActivityMapping collectionActivity={collectionActivity} address={address} />
          )}
          {loadingMoreActivity && <LoadingMoreActivity />}
        </tbody>
      </table>
    </div>
  );
};
