import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import { EthLogo } from "@Components";
import { marketplaces } from "../../options";
import { marketplacesData } from "../../../../utils/markeplacesData";
import { roundPrice } from "../../../../utils/formats/formats";
import { useBulkList } from "../../../../custom-hooks";

export const ListCheckout = React.memo(({ items }) => {
  const { bulkListNfts } = useBulkList();
  const amount = items?.length;

  const marketplaceCounts = items.reduce((acc, curr) => {
    curr.marketplaces.forEach(m => {
      if (m.name in acc) {
        acc[m.name]++;
      } else {
        acc[m.name] = 1;
      }
    });
    return acc;
  }, {});

  const marketplaceFees = items.reduce((acc, curr) => {
    curr.marketplaces.forEach(m => {
      const { name } = m;
      const { royalties } = marketplacesData[name];
      const fee = (royalties * parseFloat(m.price) || 0) / 100;
      acc += fee;
    });
    return acc;
  }, 0);

  const totalRevenue = items.reduce((acc, curr) => {
    curr.marketplaces.forEach(m => {
      acc += parseFloat(m.price) || 0;
    });
    return acc;
  }, 0);

  // const validConfirm = () => {
  // if (amount > 0) {
  // return true;
  // }
  // return false;
  // }

  const listNfts = () => {
    console.log("listNfts");
  };

  return (
    <>
      <h2>List {amount} NFTs</h2>
      <HStack justifyContent={"space-between"}>
        <p>Marketplace fees:</p>
        <EthLogo text={roundPrice(marketplaceFees) || 0} />
      </HStack>

      <div>
        {marketplaces.map(m => {
          const { name, value } = m;
          return (
            <HStack justifyContent={"space-between"}>
              <p>{name} NFTS:</p>
              <p>{marketplaceCounts[value] || 0}</p>
            </HStack>
          );
        })}
      </div>
      <hr />
      <HStack justifyContent={"space-between"}>
        <p>Revenue:</p>

        <EthLogo text={roundPrice(totalRevenue) || 0} />
      </HStack>
      <Button width={"100%"} colorScheme="blue" onClick={listNfts}>
        Confirm
      </Button>
    </>
  );
});
