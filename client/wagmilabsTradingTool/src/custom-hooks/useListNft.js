import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { UserDataContext } from "../context/userContext";
import { getListingExpirationDate } from "../utils/formats/formats";
import { marketListingMapping } from "../utils/mappings";

export const useListNft = (
  { contractAddress, tokenId, listingPrice },
  callback
) => {
  const { listingSettings } = useContext(UserDataContext);

  const toast = useToast();

  async function listNft(setConfirmingList, days) {
    try {
      setConfirmingList(true);

      const signer = await fetchSigner();
      const marketplace = listingSettings.marketplace;

      let expirationTime;

      if (days) {
        const currentTimestamp = new Date().getTime();
        expirationTime = (
          parseInt(currentTimestamp / 1000) +
          days * 24 * 60 * 60
        ).toString();
      } else {
        expirationTime = (
          getListingExpirationDate(listingSettings).getTime() / 1000
        ).toString();
      }

      const orderbook = marketListingMapping[marketplace].orderbook;
      const orderKind = marketListingMapping[marketplace].orderKind;

      const weiPrice = (listingPrice * 1000000000000000000).toString();

      await getClient()?.actions.listToken({
        listings: [
          {
            token: `${contractAddress}:${tokenId}`,
            weiPrice,
            orderbook,
            orderKind,
            expirationTime,
          },
        ],
        signer,
        onProgress: steps => {
          console.log("steps", steps);
        },
      });

      setConfirmingList(false);
      if (callback && typeof callback === "function") {
        callback();
      }

      toast({
        title: "NFT listed.",
        description: "Your NFT has been succesfully listed!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (e) {
      setConfirmingList(false);
      if (callback && typeof callback === "function") {
        callback();
      }
      toast({
        title: "Error listing NFT.",
        description:
          "There has been an error while trying to list your NFT, try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return { listNft };
};
