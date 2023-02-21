import React from "react";
import { Select, ActivityTable } from "@Components";
import { getActivityOptions } from "./functions";
import { useGetData } from "./useGetData";

import "./style.scss";

export const ItemActivity = React.memo(({ address, id }) => {
  const [types, setTypes] = React.useState([]);
  const [activities, isLoading] = useGetData(
    address,
    id,
    types.map(t => t.value).join(",")
  );
  const activityOptions = getActivityOptions();

  return (
    <div id="item-activity">
      <div className="space-between item-activity-title">
        <h2>Item Activity</h2>
        <Select
          id="filer-activity-type"
          onChange={t => setTypes(t)}
          label="Choose an item"
          value={types}
          options={Object.keys(activityOptions).map(a => ({
            value: a,
            label: activityOptions[a],
          }))}
          isMulti
        />
      </div>
      {(types.length && !(activities?.activities || []).length && (
        <h3>No activities for this filter</h3>
      )) || (
        <div className="activity-table-container">
          <ActivityTable
            collectionActivityLoading={isLoading}
            collectionActivity={activities?.activities || []}
            address={address}
            loadingMoreActivity={false}
          />
        </div>
      )}
    </div>
  );
});
