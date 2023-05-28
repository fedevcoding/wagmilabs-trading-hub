import { useTokens } from "@reservoir0x/reservoir-kit-ui";
import bigInt from "big-integer";

export function useTokensInfo(data) {
  const tokensInfo = {};
  const { data: tokens, isFetchingInitialData } = useTokens(
    data.length
      ? {
          tokens: data.map(n => n.info.nft.address + ":" + bigInt(n.info.nft.id).toString()),
        }
      : undefined
  );
  tokens.forEach(nft => {
    tokensInfo[(nft.token.contract + nft.token.tokenId).toLowerCase()] = nft.token;
  });

  return { tokensInfo, isFetchingInitialData };
}
