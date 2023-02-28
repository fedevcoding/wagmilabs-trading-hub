import { useTokens } from "@reservoir0x/reservoir-kit-ui";

export function useImages(data) {
  const images = {};
  const { data: tokens, isFetchingInitialData } = useTokens(
    data
      ? {
          tokens: data.map(n => n.info.nft.address + ":" + n.info.nft.id),
        }
      : undefined
  );
  tokens.forEach(nft => {
    images[(nft.token.contract + nft.token.tokenId).toLowerCase()] =
      nft.token.image;
  });

  return { images, isFetchingInitialData };
}
