import { useAccount } from "wagmi";

export const useGetVariables = details => {
  const { address: accountAddress } = useAccount();
  const isOwner = details ? accountAddress === details?.token?.owner : false;
  const market = Object.values(details.market)[0];

  const name = details?.token?.name || "";
  const tokenId = details?.token?.tokenId || "";
  const value = market?.price?.amount?.decimal || 0;
  const image = details?.token?.image || "";
  const marketplace = market?.source?.name || "";
  const collectionName = details?.token?.collection?.name || "";

  return {
    name,
    tokenId,
    value,
    image,
    marketplace,
    collectionName,
    isOwner,
    market,
  };
};
