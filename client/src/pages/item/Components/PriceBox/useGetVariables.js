export const useGetVariables = details => {
  const market = Object.values(details.market)[0];

  const name = details?.token?.name || "";
  const tokenId = details?.token?.tokenId || "";
  const value = market?.price?.amount?.decimal || 0;
  const image = details?.token?.image || "";
  const marketplace = market?.source?.name || "";
  const collectionName = details?.token?.collection?.name || "";
  const listingId = market?.id;

  return {
    name,
    tokenId,
    value,
    image,
    marketplace,
    collectionName,
    market,
    listingId,
  };
};
