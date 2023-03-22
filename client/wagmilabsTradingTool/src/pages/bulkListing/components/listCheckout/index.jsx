import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import { EthLogo, Loader } from "@Components";
import { marketplaces } from "../../options";
import { marketplacesData } from "../../../../utils/markeplacesData";
import { roundPrice } from "../../../../utils/formats/formats";
import { useBulkList } from "../../../../custom-hooks";
import { BulkListModal } from "../../../../components/Modals";
import { parseEther } from "@Utils";

export const ListCheckout = React.memo(({ items }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const { bulkListNfts } = useBulkList(openModal);

  function openModal(data) {
    setModalData(data);
    setIsOpen(true);
  }
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

  const isValidConfirm = () => {
    // make the button valid if: every item has at least one marketplace, all marketplaces have a price and expiration date
    const valid1 = items.every(item => {
      return item.marketplaces.every(m => {
        return (m.price || m.price === 0) && m.expiration;
      });
    });
    const valid2 = items.every(item => {
      return item.marketplaces.length > 0;
    });
    return valid1 && valid2;
  };

  const listNfts = async () => {
    if (!isValidConfirm() || loading) return;
    try {
      setLoading(true);
      const listings = items
        .map(item => {
          const { contractAddress, marketplaces, tokenId } = item;
          const id = `${contractAddress}:${tokenId}`;
          const data = marketplaces.map(m => {
            const { name, price, expiration } = m;

            const { orderKind, orderbook } = marketplacesData[name];
            const weiPrice = parseEther(price, true);
            const expirationTime = (expiration / 1000).toString();

            return {
              token: id,
              weiPrice,
              orderKind,
              orderbook,
              expirationTime,
            };
          });

          return data;
        })
        .flat();
      await bulkListNfts(listings);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BulkListModal isOpen={isOpen} onClose={setIsOpen} data={modalData} />
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
      <Button
        width={"100%"}
        colorScheme="blue"
        onClick={listNfts}
        className={`${!isValidConfirm() && "not-allowed low-opacity"}`}
      >
        {loading ? <Loader /> : <p>Confirm</p>}
      </Button>
    </>
  );
});
