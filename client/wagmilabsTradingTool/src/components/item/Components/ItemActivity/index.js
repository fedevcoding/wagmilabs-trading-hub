import React from "react";
import { Select } from "@chakra-ui/react";
import { LoadingSpinner } from "../../../utility-components";
import { getActivityOptions } from "./functions";

import "./style.css";
import { useGetData } from "./useGetData";
import { ActivityTable } from "./ActivityTable";

export const ItemActivity = React.memo(({ address, id, currency }) => {
  const [type, setType] = React.useState("");
  const [activities, isLoading] = useGetData(address, id, type);
  const activityOptions = getActivityOptions();

  return (
    <div id="item-activity">
      {(activities && !isLoading && (
        <>
          <div className="space-between item-activity-title">
            <h2>Item Activity</h2>
            <Select
              id="filer-activity-type"
              onChange={e => setType(e.target.value)}
              value={type}
              size="sm"
            >
              <option value="">Filter Type</option>
              {Object.keys(activityOptions).map(key => (
                <option value={key} key={key}>
                  {activityOptions[key]}
                </option>
              ))}
            </Select>
          </div>
          {(type && !(activities?.activities || []).length && (
            <h3>No activities for this filter</h3>
          )) || <ActivityTable activities={activities} currency={currency} />}
        </>
      )) || <LoadingSpinner />}
    </div>
  );
});
