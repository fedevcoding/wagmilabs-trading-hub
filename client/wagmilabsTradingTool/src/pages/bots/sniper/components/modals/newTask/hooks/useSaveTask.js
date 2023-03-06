import { useState } from "react";
import { useWeb3Utils } from "@Hooks";
import { pushToServer } from "@Utils";

export const useSaveTask = (callback, toggleSnipe) => {
  const { getAddressFromPrivateKey } = useWeb3Utils();

  const [isLoading, setIsLoading] = useState(false);
  const saveTask = async data => {
    try {
      setIsLoading(true);

      const { privateKey, maxPrice, minPrice } = data;

      const parsedMaxPrice = parseFloat(maxPrice) || undefined;
      const parsedMinPrice = parseFloat(minPrice) || undefined;

      const address = getAddressFromPrivateKey(privateKey);
      data["walletAddress"] = address;
      data["maxPrice"] = parsedMaxPrice;
      data["minPrice"] = parsedMinPrice;

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
