import { PageWrapper } from "@Components";
import React from "react";
import { useLocation } from "react-router-dom";
import { useSetPageTitle } from "../../custom-hooks";
import { Header, ListCheckout, Table } from "./components";
import { useItemData } from "./hooks/useItemData";
import { useSelectAll } from "./hooks/useSelectAll";

import "./style.scss";

const BulkListing = () => {
  useSetPageTitle("Bulk Listing || Wagmi labs");
  const { state } = useLocation();
  const { items, setMarketplace, setItems, changeListPrice, changeDuration } = useItemData(state);
  const {
    selectedMarketplaces,
    toggleMarketplace,
    priceValue,
    togglePrices,
    selectFp,
    selectAllExpirations,
    selectedExpiration,
  } = useSelectAll(items, setItems);

  return (
    <PageWrapper page={"bulk-listing"}>
      <div className="section-left">
        <Header
          selectedMarketplaces={selectedMarketplaces}
          toggleMarketplace={toggleMarketplace}
          priceValue={priceValue}
          togglePrices={togglePrices}
          selectFp={selectFp}
          selectAllExpirations={selectAllExpirations}
          selectedExpiration={selectedExpiration}
        />
        <Table
          items={items}
          setMarketplace={setMarketplace}
          changeListPrice={changeListPrice}
          changeDuration={changeDuration}
        />
      </div>
      <div className="section-right">
        <ListCheckout items={items} />
      </div>
    </PageWrapper>
  );
};

export default BulkListing;
