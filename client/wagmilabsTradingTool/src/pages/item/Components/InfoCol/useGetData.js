import { useListings } from "@reservoir0x/reservoir-kit-ui";
import { useAccount } from "wagmi";

export function useGetData(details, address, id) {
  const { address: accountAddress } = useAccount();
  const isOwner = details
    ? accountAddress?.toLowerCase() === details?.token?.owner?.toLowerCase()
    : false;
  const collectionImage = details.token?.collection?.image;

  const currency =
    Object.values(details.market)[0]?.price?.currency?.symbol || "ETH";

  const { data: listings, isFetchingListings } = useListings({
    token: [`${address}:${id}`],
    sortBy: "price",
    limit: 20,
  });

  return { collectionImage, currency, isOwner, listings, isFetchingListings };
}
