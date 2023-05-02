import { ethers } from "ethers";
import { subscriptionAddress, subscriptionsAbi } from "../variables/subscriptionContract";
import { fetchSigner } from "@wagmi/core";
import { pushToServer } from "../utils/functions/serverCalls";
import { checkErrors } from "../utils/functions/errorHelpers";
import { useToast } from "@chakra-ui/react";
import ReactGA from "react-ga";
import { useLocationParams } from "./useLocationParams";
import { useContext } from "react";
import { UserDataContext } from "../context/userContext";
import logOut from "../utils/functions/logout";

ReactGA.initialize("GTM-WWSJ25L");

export const useSubscribe = () => {
  const toast = useToast();
  const { source } = useLocationParams();
  const { connected, loading, setConnected } = useContext(UserDataContext);

  const subscribe = async (planId, months, price) => {
    try {
      const signer = await fetchSigner();

      // const sevenDayInMilliSeconds = 604800000;
      // const endDate = new Date(Date.now() + sevenDayInMilliSeconds);
      // if (planId === 0) {
      //         const message = `Start your 7 day free trial today!
      // Your trial will end ${endDate.toDateString()}.`;
      //         const address = await signer.getAddress();
      //         const signature = await signer.signMessage(message);
      //         const res = await pushToServer("/freeTrial", { signature, address, message });

      //         if (res.authenticated) {
      //           ReactGA.event({
      //             category: "freetrial",
      //             action: "Created free trial",
      //           });

      //           toast({
      //             title: "Success",
      //             description: "Free trial activated",
      //             status: "success",
      //             duration: 5000,
      //             isClosable: true,
      //           });
      //         }
      // } else {
      const contract = new ethers.Contract(subscriptionAddress, subscriptionsAbi, signer);
      // if (planId === 1) {
      //   const tx = await contract.subscribeBasic(months, [], {
      //     value: ethers.utils.parseEther(price.toFixed(5).toString()),
      //   });
      //   await tx.wait();
      //   ReactGA.event({
      //     category: "subscription",
      //     action: "Created subscription",
      //   });
      //   await pushToServer("/stats", { type: "boughtBasic", timestamp: Date.now(), source });
      //   toast({
      //     title: "Success",
      //     description: "Started plan activated",
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // }
      if (planId === 2) {
        const tx = await contract.subscribePro(months, [], {
          value: ethers.utils.parseEther(price.toFixed(5).toString()),
        });
        await tx.wait();
        ReactGA.event({
          category: "subscription",
          action: "Created subscription",
        });
        await pushToServer("/stats", { type: "boughtPro", timestamp: Date.now(), source });

        if (connected && !loading) {
          await logOut(setConnected);
        } else {
          toast({
            title: "Success",
            description: "Pro plan activated",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      }
      // }
    } catch (error) {
      console.log(error);
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
