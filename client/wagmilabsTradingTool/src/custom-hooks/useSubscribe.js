import { ethers } from "ethers";
import { subscriptionAddress, subscriptionsAbi } from "../variables/subscriptionContract";
import { fetchSigner } from "@wagmi/core";

export const useSubscribe = () => {
  const subscribe = async (planId, months, price) => {
    try {
      const signer = await fetchSigner();
      const contract = new ethers.Contract(subscriptionAddress, subscriptionsAbi, signer);
      console.log(contract, signer);
      if (planId === 1) {
        const tx = await contract.subscriptionsOpen();
        // const receipt = await tx.wait();
        console.log(tx);
      } else if (planId === 2) {
        const tx = await contract.subscribePro(months, { value: ethers.utils.parseEther(price.toString()) });
        const receipt = await tx.wait();
        console.log(receipt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { subscribe };
};
