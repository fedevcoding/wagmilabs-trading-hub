import { fetchSigner } from "@wagmi/core";
import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";

const safeTransferAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const useTransferItem = () => {
  const toast = useToast();

  async function transferNft(contract, tokenId, toAddress) {
    try {
      const signer = await fetchSigner();
      const contractInstance = new ethers.Contract(
        contract,
        safeTransferAbi,
        signer
      );
      contractInstance.connect(signer);
      const fromAddress = await signer.getAddress();
      const tx = await contractInstance[
        "safeTransferFrom(address,address,uint256)"
      ](fromAddress, toAddress, tokenId);
      await tx.wait(1);

      toast({
        title: "Success",
        description: "NFT successfully transferred",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      const error = e?.response?.data?.message || "Something went wrong";

      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return { transferNft };
};
