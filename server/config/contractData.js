const contractAddress = "0x280cf156727ba24f83ca8193a871dfcaeb9afa9b";
const contractAbi = [
  {
    inputs: [{ internalType: "address", name: "walletAddress", type: "address" }],
    name: "hasValidPass",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

module.exports = {
  contractAddress,
  abi: contractAbi,
};
