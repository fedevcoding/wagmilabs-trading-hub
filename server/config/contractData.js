const contractAddress = "0x720717021fc08e8ca79ca314be4b4172686e8c02";
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
