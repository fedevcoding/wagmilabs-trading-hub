import { ETHEREUM_NETWORK } from "@Variables";
import Web3 from "web3";

export const useProvider = () => {
  const web3 = new Web3(ETHEREUM_NETWORK);

  return { web3 };
};
