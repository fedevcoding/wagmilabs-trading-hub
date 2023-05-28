import React from "react";
import { LoadingSpinner, Tabs, ActivityTable } from "@Components";
import { ActivityChart, ActivityFilters } from "./Components";
import { changeActivityFilter, periods } from "./functions";

import "./style.scss";
import { useGetData } from "./useGetData";

const Activity = React.memo(({ address }) => {
  const {
    chartPeriod,
    loadingChart,
    activityChartData,
    collectionActivity,
    loadingMoreActivity,
    collectuonActivityFilter,
    collectionActivityLoading,
    setChartPeriod,
    setCollectionActivityFilter,
  } = useGetData(address);

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
              <Tabs tabs={periods.map(p => p.value)} active={chartPeriod} setTab={value => setChartPeriod(value)} />
            </div>
            <div className="activity-chart-wrapper">
              {loadingChart ? (
                <LoadingSpinner />
              ) : (
                <ActivityChart activityChartData={activityChartData} loadingChart={loadingChart} />
              )}
            </div>
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
