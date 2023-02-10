import React from "react";
import { LoadingSpinner } from "../../../utility-components";
import { getActivityOptions } from "./functions";
import { Select } from "../../../utility-components";

import "./style.scss";
import { useGetData } from "./useGetData";
import { ActivityTable } from "./ActivityTable";

export const ItemActivity = React.memo(({ address, id, currency }) => {
  const [types, setTypes] = React.useState([]);
  const [activities, isLoading] = useGetData(
    address,
    id,
    types.map(t => t.value).join(",")
  );
  const activityOptions = getActivityOptions();

  return (
    <div id="item-activity">
      {(activities && !isLoading && (
        <>
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
              <ActivityTable activities={activities} currency={currency} />
            </div>
          )}
        </>
      )) || <LoadingSpinner />}
    </div>
  );
});
