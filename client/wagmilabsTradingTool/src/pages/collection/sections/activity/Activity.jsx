import React from "react";
import { Tabs } from "@Components";
import { ActivityChart, ActivityFilters, ActivityTable } from "./Components";
import { changeActivityFilter, periods } from "./functions";

import "./style.scss";
import { useGetData } from "./useGetData";

const Activity = React.memo(({ address }) => {
  const {
    chartPeriod,
    activityChartData,
    collectionActivity,
    loadingMoreActivity,
    collectuonActivityFilter,
    collectionActivityLoading,
    setChartPeriod,
    setCollectionActivityFilter,
  } = useGetData(address);

  console.log(
    collectionActivity,
    loadingMoreActivity,
    collectionActivityLoading
  );

  return (
    <>
      <hr className="collection-activity-hr" />
      <div className="collection-activity-section">
        <ActivityFilters
          changeActivityFilter={changeActivityFilter}
          collectuonActivityFilter={collectuonActivityFilter}
          setCollectionActivityFilter={setCollectionActivityFilter}
        />
        <div className="collection-activity-container">
          <div className="collection-activity-chart-container">
            <div className="chart-period-container">
              <Tabs
                tabs={periods.map(p => p.value)}
                active={chartPeriod}
                setTab={value => setChartPeriod(value)}
              />
            </div>
            <ActivityChart activityChartData={activityChartData} />
          </div>

          <ActivityTable
            address={address}
            collectionActivity={collectionActivity}
            loadingMoreActivity={loadingMoreActivity}
            collectionActivityLoading={collectionActivityLoading}
          />
        </div>
      </div>
    </>
  );
});

export default Activity;
