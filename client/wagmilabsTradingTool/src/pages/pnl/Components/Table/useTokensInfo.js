import { useTokens } from "@reservoir0x/reservoir-kit-ui";

export function useTokensInfo(data) {
  const tokensInfo = {};
  const { data: tokens, isFetchingInitialData } = useTokens(
    data.length
      ? {
          tokens: data.map(n => n.info.nft.address + ":" + n.info.nft.id),
        }
      : undefined
  );
  tokens.forEach(nft => {
    tokensInfo[(nft.token.contract + nft.token.tokenId).toLowerCase()] = nft.token;
  });

  return { tokensInfo, isFetchingInitialData };
}
