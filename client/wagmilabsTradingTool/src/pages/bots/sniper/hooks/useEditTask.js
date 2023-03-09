import { useState } from "react";
import { useWeb3Utils } from "@Hooks";
import { pushToServer } from "@Utils";
import { useToast } from "@chakra-ui/react";

export const useEditTask = (callback, toggleSnipe) => {
  const toast = useToast();

  const { getAddressFromPrivateKey } = useWeb3Utils();

  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [restartingLoading, setRestartLoading] = useState(false);

  const saveTask = async data => {
    try {
      setAddLoading(true);

      const { privateKey, maxPrice, minPrice, maxFeePerGas, maxPriorityFeePerGas, maxFeePerGasType, maxAutoBuy } = data;

      const parsedMaxPrice = parseFloat(maxPrice) || undefined;
      const parsedMinPrice = parseFloat(minPrice) || undefined;
      const parsedMaxFeePerGas = maxFeePerGasType !== "auto" ? parseFloat(maxFeePerGas) || undefined : undefined;
      const parsedMaxPriorityFeePerGas = parseFloat(maxPriorityFeePerGas) || undefined;
      const parsedMaxAutoBuy = parseFloat(maxAutoBuy) || undefined;

      const taskId = crypto.randomUUID();

      const address = getAddressFromPrivateKey(privateKey);
      data["walletAddress"] = address;
      data["maxPrice"] = parsedMaxPrice;
      data["minPrice"] = parsedMinPrice;
      data["maxFeePerGas"] = parsedMaxFeePerGas;
      data["maxPriorityFeePerGas"] = parsedMaxPriorityFeePerGas;
      data["taskId"] = taskId;
      data["maxAutoBuy"] = parsedMaxAutoBuy;
      data["remaining"] = parsedMaxAutoBuy;

      const body = { data, type: "add" };

      await pushToServer("/bots/sniper/editTask", body);
      toggleSnipe("add", data);
    } catch (e) {
      console.log(e);
    } finally {
      setAddLoading(false);
      callback();
    }
  };

  const removeTask = async taskId => {
    try {
      setRemoveLoading(true);
      const body = { data: taskId, type: "remove" };
      await pushToServer("/bots/sniper/editTask", body);
      toggleSnipe("remove", taskId);

      toast({
        title: "Task removed",
        description: "Task removed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  const restartTask = async taskId => {
    try {
      setRestartLoading(true);
      const privateKey = "";
      const body = {
        data: {
          taskId,
          privateKey,
        },
        type: "restart",
      };
      await pushToServer("/bots/sniper/editTask", body);

      toggleSnipe("restart", taskId);
      toast({
        title: "Task restarted",
        description: "Task restarted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRestartLoading(false);
    }
  };

  return { saveTask, addLoading, removeTask, removeLoading, restartTask };
};
