const subscriptionAddress = "0xC776E3F1008E14aD300E4FF9A310e83b2a2B70D1";

const subscriptionsAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "basicAddressExpiration",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "changeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "monthlyPrice", type: "uint256" },
      { internalType: "uint256", name: "monthsAmount", type: "uint256" },
      { internalType: "uint256", name: "planType", type: "uint256" },
    ],
    name: "changePriceWei",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "ownerAddress", type: "address" }],
    name: "checkSubscriptionAdvanced",
    outputs: [
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "walletAddress", type: "address" }],
    name: "hasValidBasicSubscription",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "walletAddress", type: "address" }],
    name: "hasValidProSubscription",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "proAddressExpiration",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "_open", type: "bool" }],
    name: "setOpen",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "months", type: "uint256" }],
    name: "subscribeBasic",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "months", type: "uint256" }],
    name: "subscribePro",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "months", type: "uint256" }],
    name: "subscriptionsBasicPrice",
    outputs: [{ internalType: "uint256", name: "monthPrice", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "subscriptionsOpen",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "months", type: "uint256" }],
    name: "subscriptionsProPrice",
    outputs: [{ internalType: "uint256", name: "monthPrice", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
];

export { subscriptionAddress, subscriptionsAbi };
