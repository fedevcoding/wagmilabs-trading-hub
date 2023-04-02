const teamAddresses = [
  "0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8",
  "0x7cb557AE9671904f44BE5366772A429259077de5",
  "0x1a744599bC7355C95e5b7351e4A106bB4B579CcC",
  "0x8bC20C9238E9674c9066473968bEeBde0c24393a",
  "0xfe697c5527ab86daa1e4c08286d2be744a0e321e",
];
const allowedAddresses = [];

const isTeam = address => teamAddresses.find(a => a?.toLowerCase() === address?.toLowerCase())?.length > 0;

module.exports = { allowedAddresses, teamAddresses, isTeam };
