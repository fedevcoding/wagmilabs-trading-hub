import { useContext } from "react";
import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-sdk";
import { useToast } from "@chakra-ui/react";
import { UserDataContext } from "@Context";
import { getListingExpirationDate } from "@Utils/formats/formats";
import { marketplacesData } from "@Utils";
import { checkErrors } from "../utils/functions/errorHelpers";
import { parseEther } from "ethers/lib/utils";
import { ethToWei } from "../utils/formats/formats";

export const useListNft = ({ contractAddress, tokenId, listingPrice }, callback) => {
  const { listingSettings } = useContext(UserDataContext);

  const toast = useToast();

  async function listNft(setConfirmingList, expirationTime = null, marketplaceName = null, royaltiesPerc = null) {
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

      const orderbook = marketplacesData[marketplace].orderbook;
      const orderKind = marketplacesData[marketplace].orderKind;

      const weiPrice = ethToWei(listingPrice, true);

      const royalties = royaltiesPerc
        ? {
            automatedRoyalties: true,
            royaltyBps: parseFloat(royaltiesPerc) * 100,
          }
        : {};

      await getClient()?.actions.listToken({
        listings: [
          {
            token: `${contractAddress}:${tokenId}`,
            weiPrice,
            orderbook,
            orderKind,
            expirationTime,
            ...royalties,
          },
        ],
        signer,
        onProgress: steps => console.log(steps),
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
      const error = checkErrors(e);

      toast({
        title: "Error listing NFT.",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return { listNft };
};
