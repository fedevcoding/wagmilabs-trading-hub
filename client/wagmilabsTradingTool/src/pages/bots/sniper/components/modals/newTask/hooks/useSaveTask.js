import { useState } from "react";
import { useWeb3Utils } from "@Hooks";

export const useSaveTask = callback => {
  const { getAddressFromPrivateKey } = useWeb3Utils();

  const [isLoading, setIsLoading] = useState(false);
  const saveTask = async data => {
    setIsLoading(true);

    const { privateKey } = data;
    const address = getAddressFromPrivateKey(privateKey);

    alert(address);
    callback();
    setIsLoading(false);
  };

  return { saveTask, isLoading };
};
