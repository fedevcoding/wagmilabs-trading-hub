import { useContext } from "react";
import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useToast } from "@chakra-ui/react";
import { UserDataContext } from "@Context";
import { getListingExpirationDate } from "@Utils/formats/formats";
import { marketListingMapping } from "@Utils/mappings";

export const useListNft = ({ contractAddress, tokenId, listingPrice }, callback) => {
  const { listingSettings } = useContext(UserDataContext);

  const toast = useToast();

  async function listNft(setConfirmingList, expirationTime = null, marketplaceName = null) {
    if (listingPrice < 0 || listingPrice === null || listingPrice === "") {
      toast({
        title: "Error listing NFT.",
        description: "Please, insert a valid price",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return 0;
    }

    try {
      setConfirmingList(true);

      const signer = await fetchSigner();
      const marketplace = marketplaceName || listingSettings.marketplace;

      if (!expirationTime) {
        expirationTime = (getListingExpirationDate(listingSettings).getTime() / 1000).toString();
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
        description: "There has been an error while trying to list your NFT, try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return { listNft };
};
