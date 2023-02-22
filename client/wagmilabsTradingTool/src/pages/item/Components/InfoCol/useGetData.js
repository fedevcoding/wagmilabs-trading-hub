import { useListings, useUserTokens } from "@reservoir0x/reservoir-kit-ui";
import { useAccount } from "wagmi";

export function useGetData(details, address, id) {
  const { address: accountAddress } = useAccount();
  const collectionImage = details.token?.collection?.image;
  const isErc721 = details.token?.kind === "erc721";
  const { data: tokens } = useUserTokens(accountAddress, {
    tokens: [`${address}:${id}`],
  });

  const isOwner = tokens.length;
  const ownershipTokenCount = isOwner ? tokens[0]?.ownership?.tokenCount : null;

  const ownerBestListing =
    details?.market?.floorAsk?.maker?.toLowerCase() ===
    accountAddress?.toLowerCase();

  const currency =
    Object.values(details.market)[0]?.price?.currency?.symbol || "ETH";

  const { data: listings, isFetchingListings } = useListings({
    token: [`${address}:${id}`],
    sortBy: "price",
    limit: 20,
  });

  return {
    collectionImage,
    currency,
    isOwner,
    listings,
    isFetchingListings,
    isErc721,
    accountAddress,
    ownerBestListing,
    ownershipTokenCount,
  };
}
