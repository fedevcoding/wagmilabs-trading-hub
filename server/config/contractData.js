const contractAddress = "0xe3106d8910e3fce945b2b3ab9104c38a4588a2cf";
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
