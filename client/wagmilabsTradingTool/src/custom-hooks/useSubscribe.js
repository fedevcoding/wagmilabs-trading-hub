import { ethers } from "ethers";
import { subscriptionAddress, subscriptionsAbi } from "../variables/subscriptionContract";
import { fetchSigner } from "@wagmi/core";
import { pushToServer } from "../utils/functions/serverCalls";

export const useSubscribe = () => {
  const subscribe = async (planId, months, price) => {
    try {
      const signer = await fetchSigner();

      if (planId === 0) {
        const message = "Free Trial";
        const address = await signer.getAddress();
        const signature = await signer.signMessage(message);
        const res = await pushToServer("/freeTrial", { signature, address, message });
        console.log(res);
      } else {
        const contract = new ethers.Contract(subscriptionAddress, subscriptionsAbi, signer);
        if (planId === 1) {
          const tx = await contract.subscribeBasic(months, {
            value: ethers.utils.parseEther(price.toFixed(5).toString()),
          });
          await tx.wait();
        } else if (planId === 2) {
          const tx = await contract.subscribePro(months, {
            value: ethers.utils.parseEther(price.toFixed(5).toString()),
          });
          await tx.wait();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { subscribe };
};
