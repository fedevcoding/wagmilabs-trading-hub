const contractAddress = "0x453296a7C5fbaC94c766eF1bCCC57b396b86538f";
const contractAbi = [
  {
    inputs: [{ internalType: "address", name: "walletAddress", type: "address" }],
    name: "hasValidPass",
    outputs: [
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

module.exports = {
  contractAddress,
  abi: contractAbi,
};
