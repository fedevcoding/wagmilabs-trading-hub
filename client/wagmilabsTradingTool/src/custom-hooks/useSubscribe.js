import { ethers } from "ethers";
import { subscriptionAddress, subscriptionsAbi } from "../variables/subscriptionContract";
import { fetchSigner } from "@wagmi/core";
import { pushToServer } from "../utils/functions/serverCalls";
import { checkErrors } from "../utils/functions/errorHelpers";
import { useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { UserDataContext } from "../context/userContext";

export const useSubscribe = () => {
  const { fromCatchMint } = useContext(UserDataContext);

  const toast = useToast();
  const subscribe = async (planId, months, price) => {
    try {
      const signer = await fetchSigner();

      const sevenDayInMilliSeconds = 604800000;
      const endDate = new Date(Date.now() + sevenDayInMilliSeconds);
      if (planId === 0) {
        const message = `Start your 7 day free trial today!
Your trial will end ${endDate.toDateString()}.`;
        const address = await signer.getAddress();
        const signature = await signer.signMessage(message);
        const res = await pushToServer("/freeTrial", { signature, address, message, fromCatchMint });

        if (res.authenticated) {
          toast({
            title: "Success",
            description: "Free trial activated",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        const contract = new ethers.Contract(subscriptionAddress, subscriptionsAbi, signer);
        if (planId === 1) {
          const tx = await contract.subscribeBasic(months, [], {
            value: ethers.utils.parseEther(price.toFixed(5).toString()),
          });
          await tx.wait();

          await pushToServer("/stats", { type: "boughtBasic", timestamp: Date.now(), fromCatchMint });
          toast({
            title: "Success",
            description: "Started plan activated",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else if (planId === 2) {
          const tx = await contract.subscribePro(months, [], {
            value: ethers.utils.parseEther(price.toFixed(5).toString()),
          });
          await tx.wait();
          await pushToServer("/stats", { type: "boughtPro", timestamp: Date.now(), fromCatchMint });

          toast({
            title: "Success",
            description: "Pro plan activated",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      const message = checkErrors(String(error));

      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return { subscribe };
};
