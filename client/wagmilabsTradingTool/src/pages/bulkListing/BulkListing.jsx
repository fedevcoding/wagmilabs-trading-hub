import { Button } from "@chakra-ui/react";
import { PageWrapper } from "@Components";
import React from "react";
import { useLocation } from "react-router-dom";
import { Header, Table } from "./components";
import { useItemData } from "./hooks/useItemData";
import { useSelectedMarketplaces } from "./hooks/useSelectedMarketplaces";

import "./style.scss";

const BulkListing = () => {
  const { state } = useLocation();
  const { items, setMarketplace, setItems, changeListPrice } = useItemData(state);
  const { selectedMarketplaces, toggleMarketplace } = useSelectedMarketplaces(items, setItems);

  return (
    <PageWrapper page={"bulk-listing"}>
      <div className="section-left">
        <Header selectedMarketplaces={selectedMarketplaces} toggleMarketplace={toggleMarketplace} />
        <Table items={items} setMarketplace={setMarketplace} changeListPrice={changeListPrice} />
      </div>
      <div className="section-right">
        <h2>List {items.length} NFTs</h2>
        <p>Marketplace fees:</p>
        <hr />
        <p>Revenue:</p>
        <Button width={"100%"}>Confirm</Button>
      </div>
    </PageWrapper>
  );
};

export default BulkListing;
