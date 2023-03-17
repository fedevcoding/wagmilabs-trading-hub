import { HStack } from "@chakra-ui/react";
import React from "react";
import { notFound } from "src/assets";

export const NoDataFound = () => {
  return (
    <HStack className="col">
      <img src={notFound} alt="no data found" />
      <p>No data found</p>
    </HStack>
  );
};
