import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import { useGetReservoirOptions } from ".";

export const useBuyNow = () => {
  const { options } = useGetReservoirOptions();

  async function buyNow(contract, tokenId, value) {
    const signer = await fetchSigner();

    getClient()?.actions.buyToken({
      tokens: [{ tokenId, contract: contract }],
      signer,
      options,
      expectedPrice: value,
      onProgress: steps => {
        console.log(steps);
      },
    });
  }

  return { buyNow };
};
