const contractAddress = "0xc11cA7A9D21aAbc703B97A7309E668b6fe4B4a77";
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
