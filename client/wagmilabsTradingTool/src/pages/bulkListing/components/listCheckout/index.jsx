import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import { EthLogo } from "@Components";

export const ListCheckout = ({ items }) => {
  const amount = items?.length;

  const openseaAmount = items?.filter(item => item.marketplaces.includes("opensea")).length;
  const x2y2Amount = items?.filter(item => item.marketplaces.includes("x2y2")).length;
  const looksRareAmount = items?.filter(item => item.marketplaces.includes("looksrare")).length;

  return (
    <>
      <h2>List {amount} NFTs</h2>
      <HStack justifyContent={"space-between"}>
        <p>Marketplace fees:</p>

        <EthLogo text={"0.01"} />
      </HStack>

      <div>
        <HStack justifyContent={"space-between"}>
          <p>Opensea NFTS:</p>
          <p>{openseaAmount}</p>
        </HStack>
        <HStack justifyContent={"space-between"}>
          <p>X2Y2 NFTS:</p>
          <p>{x2y2Amount}</p>
        </HStack>
        <HStack justifyContent={"space-between"}>
          <p>LooksRare NFTS:</p>
          <p>{looksRareAmount}</p>
        </HStack>
      </div>
      <hr />
      <HStack justifyContent={"space-between"}>
        <p>Revenue:</p>

        <EthLogo text={"0.121"} />
      </HStack>
      <Button width={"100%"} colorScheme="blue">
        Confirm
      </Button>
    </>
  );
};
