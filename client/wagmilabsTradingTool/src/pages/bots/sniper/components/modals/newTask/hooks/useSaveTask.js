import { useState } from "react";
import { useWeb3Utils } from "@Hooks";
import { pushToServer } from "@Utils";

export const useSaveTask = (callback, toggleSnipe) => {
  const { getAddressFromPrivateKey } = useWeb3Utils();

  const [isLoading, setIsLoading] = useState(false);
  const saveTask = async data => {
    try {
      setIsLoading(true);

      const { privateKey, maxPrice, minPrice, maxFeePerGas, maxPriorityFeePerGas } = data;

      const parsedMaxPrice = parseFloat(maxPrice) || undefined;
      const parsedMinPrice = parseFloat(minPrice) || undefined;
      const parsedMaxFeePerGas = parseFloat(maxFeePerGas) || undefined;
      const parsedMaxPriorityFeePerGas = parseFloat(maxPriorityFeePerGas) || undefined;

      const address = getAddressFromPrivateKey(privateKey);
      data["walletAddress"] = address;
      data["maxPrice"] = parsedMaxPrice;
      data["minPrice"] = parsedMinPrice;
      data["maxFeePerGas"] = parsedMaxFeePerGas;
      data["maxPriorityFeePerGas"] = parsedMaxPriorityFeePerGas;

      const body = { data, type: "add" };

      await pushToServer("/bots/sniper/newTask", body);
      toggleSnipe("add", data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      callback();
    }
  };

  return { saveTask, isLoading };
};
