import React from "react";
import { UserDataContext } from "../context/userContext";
import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";

export const useBuyNow = () => {
  const { gasSettings } = React.useContext(UserDataContext);

  async function buyNow(contract, tokenId, value) {
    const signer = await fetchSigner();
    const maxFeePerGas = (gasSettings.maxFeePerGas * 1000000000).toString();
    const maxPriorityFeePerGas = (
      gasSettings.maxPriorityFeePerGas * 1000000000
    ).toString();

    getClient()?.actions.buyToken({
      tokens: [{ tokenId, contract: contract }],
      signer,
      options: {
        maxFeePerGas,
        maxPriorityFeePerGas,
      },
      expectedPrice: value,
      onProgress: steps => {
        console.log(steps);
      },
    });
  }

  return { buyNow };
};
