import React from "react";

export const ActivityFilters = ({
  changeActivityFilter,
  collectuonActivityFilter,
  setCollectionActivityFilter,
}) => {
  return (
    <div className="collection-activity-filters-container">
      <p>CATEGORY</p>

      <div className="collection-activity-filters-categories">
        <div
          onClick={() =>
            changeActivityFilter(
              "sale",
              collectuonActivityFilter,
              setCollectionActivityFilter
            )
          }
          className={`${
            collectuonActivityFilter.includes("sale") ? "active" : ""
          }`}
        >
          <i className="fa-light fa-bag-shopping"></i>
          Sales
        </div>
        <div
          onClick={() =>
            changeActivityFilter(
              "ask",
              collectuonActivityFilter,
              setCollectionActivityFilter
            )
          }
          className={`${
            collectuonActivityFilter.includes("ask") ? "active" : ""
          }`}
        >
          <i className="fa-light fa-tag"></i>
          Listings
        </div>
      </div>
      <div className="collection-activity-filters-categories">
        <div
          onClick={() =>
            changeActivityFilter(
              "bid",
              collectuonActivityFilter,
              setCollectionActivityFilter
            )
          }
          className={`${
            collectuonActivityFilter.includes("bid") ? "active" : ""
          }`}
        >
          <i className="fa-light fa-megaphone"></i>
          Offers
        </div>
        <div
          onClick={() =>
            changeActivityFilter(
              "transfer",
              collectuonActivityFilter,
              setCollectionActivityFilter
            )
          }
          className={`${
            collectuonActivityFilter.includes("transfer") ? "active" : ""
          }`}
        >
          <i className="fa-light fa-truck"></i>
          Transfers
        </div>
      </div>
      {/* <div className='collection-activity-filters-categories'>
          <div>
            List cancels
          </div>
          <div>
            Offer canecls
          </div>
        </div> */}
    </div>
  );
};
