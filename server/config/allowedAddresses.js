const teamAddresses = [
  "0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8",
  "0x7cb557AE9671904f44BE5366772A429259077de5",
  "0x1a744599bC7355C95e5b7351e4A106bB4B579CcC",
  "0xfe32B27a625Fb30FD1cA632D7788e80dc35Dad89",
  "0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E",
];

const allowedAddresses = [];

const isTeam = address => teamAddresses.find(a => a?.toLowerCase() === address?.toLowerCase())?.length > 0;
const wasAllowed = address =>
  allowedAddresses.find(a => a?.address?.toLowerCase() === address?.toLowerCase())?.address ? true : false;

module.exports = { allowedAddresses, teamAddresses, isTeam, wasAllowed };
