import { HStack } from "@chakra-ui/react";
import { PageWrapper } from "@Components";
import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./components";

import "./style.scss";

const BulkListing = () => {
  const { state: items } = useLocation();

  return (
    <PageWrapper page={"bulk-listing"}>
      <div className="section-left">
        <Header />
      </div>
      <div></div>
    </PageWrapper>
  );
};

export default BulkListing;
